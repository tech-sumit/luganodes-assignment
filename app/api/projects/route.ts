import {createClient} from '@/utils/supabase/server';
import {cookies} from "next/headers";
import {CreateProjectSchema, DeleteProjectSchema, GetProjectSchema, UpdateProjectSchema} from "@/app/models/project";
import {NextRequest, NextResponse} from "next/server";

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(req: NextRequest) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const {data: {session}} = await supabase.auth.getSession()

    if (req.nextUrl.searchParams.has('project_name') && req.nextUrl.searchParams.get('project_name')) {
        var {data: project} = await supabase.from("projects")
            .select()
            .eq('user_id', session?.user.id)
            .eq('project_name', req.nextUrl.searchParams.get('project_name'))
            .limit(1);
        if (project && project.length == 1) {
            project = project[0]
        }
        return NextResponse.json(
            {message: 'Projects fetched', data: GetProjectSchema.validate(project).value},
            {status: 200}
        )
    }

    const {data} = await supabase.from("projects")
        .select()
        .eq('user_id', session?.user.id);
    return NextResponse.json(
        {message: 'Projects fetched', data: GetProjectSchema.validate(data).value},
        {status: 200}
    )
}

export async function POST(req: Request) {
    // Authenticate session
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const {data: {session}} = await supabase.auth.getSession()

    const body = await req.json()

    // Validate request
    let {error: validationError, value: project} = CreateProjectSchema.validate(body)
    if (validationError) {
        return NextResponse.json({error: validationError}, {status: 400})
    }

    //Set user_id being authenticated user
    project.user_id = session?.user.id

    // Add a new project
    const {data: newProject, error: dbError} = await supabase.from("projects")
        .insert(project)
        .select();

    if (dbError) {
        console.error('Error adding project:', dbError);
        return NextResponse.json({error: 'Error adding project'}, {status: 500})
    }

    // Return response
    console.error('Project created:', newProject);
    return NextResponse.json(
        {message: 'Project created', data: GetProjectSchema.validate(newProject).value},
        {status: 201}
    )
}

export async function PUT(req: Request) {
    // Authenticate session
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const {data: {session}} = await supabase.auth.getSession()

    const body = await req.json()

    // Validate request
    let {error: validationError, value: project} = UpdateProjectSchema.validate(body)
    if (validationError) {
        return NextResponse.json({error: validationError}, {status: 400})
    }

    //Set user_id being authenticated user
    project.user_id = session?.user.id

    // Add a new project
    const {data: updatedProject, error: dbError} = await supabase.from("projects")
        .update({
            description: project.description,
            repo_url: project.repo_url,
            container_port: project.container_port,
            entrypoint: project.entrypoint,
            envs: project.envs
        })
        .eq('user_id', project.user_id)
        .eq('project_name', project.project_name)
        .select();

    if (dbError) {
        console.error('Error updating project:', dbError);
        return NextResponse.json({error: 'Error updating project'}, {status: 500})
    }

    // Return response
    console.error('Project updated:', updatedProject);
    return NextResponse.json(
        {message: 'Project updated', data: GetProjectSchema.validate(updatedProject).value},
        {status: 201}
    )
}


export async function DELETE(req: Request) {
    // Authenticate session
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const {data: {session}} = await supabase.auth.getSession()

    const body = await req.json()

    // Validate request
    let {error: validationError, value: project} = DeleteProjectSchema.validate(body)
    if (validationError) {
        return NextResponse.json({error: validationError}, {status: 400})
    }

    //Set user_id being authenticated user
    project.user_id = session?.user.id

    // Add a new project
    const {data: deletedProject, error: dbError} = await supabase.from("projects")
        .update({
            deleted_at: new Date().toISOString()
        })
        .eq('user_id', project.user_id)
        .eq('project_name', project.project_name)
        .select();

    if (dbError) {
        console.error('Error soft deleting project:', dbError);
        return NextResponse.json({error: 'Error updating project'}, {status: 500})
    }

    // Return response
    console.error('Project soft deleted:', deletedProject);
    return NextResponse.json(
        {message: 'Project deleted', data: GetProjectSchema.validate(deletedProject).value},
        {status: 201}
    )
}
