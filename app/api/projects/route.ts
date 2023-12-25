import {createClient} from '@/utils/supabase/server';
import {cookies} from "next/headers";
import {CreateProjectSchema, DeleteProjectSchema, GetProjectSchema, UpdateProjectSchema} from "@/app/models/project";
import {NextRequest, NextResponse} from "next/server";
import TriggerWorkflow from "@/app/api/projects/trigger_workflow";

if (!process.env.GITHUB_TOKEN
    || !process.env.REPO_OWNER
    || !process.env.REPO_NAME
    || !process.env.DEFAULT_BRANCH
) {
    console.log("Environment variables missing to initialise Github integration. shutting down server.")
    process.exit(1)
}

const trigger = new TriggerWorkflow(
    process.env.GITHUB_TOKEN,
    process.env.REPO_OWNER,
    process.env.REPO_NAME
)

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
    let {data: newProject, error: dbError} = await supabase.from("projects")
        .insert(project)
        .select().limit(1);

    if (dbError) {
        console.error('Error adding project:', dbError);
        return NextResponse.json({error: 'Error adding project'}, {status: 500})
    }

    console.error('Project created:', newProject);

    if (newProject && newProject.length == 1) {
        newProject = newProject[0]
    }
    let projectToTrigger = GetProjectSchema.validate(newProject).value

    // Trigger workflow
    const triggerResponse = await trigger.createAndDeploy({
        container_port: `${projectToTrigger.container_port}`,
        entrypoint: JSON.stringify(projectToTrigger.entrypoint),
        host_port: `${projectToTrigger.host_port}`,
        project_name: projectToTrigger.project_name,
        repo_url: projectToTrigger.repo_url
    })

    if (!triggerResponse.isSuccess) {
        console.log(`ERROR: ${triggerResponse.error}`)
        return NextResponse.json(
            {
                message: `Project created but trigger failed ERROR: ${triggerResponse.message}`,
                data: GetProjectSchema.validate(newProject).value
            },
            {status: 500}
        )
    }

    // Return response
    return NextResponse.json(
        {message: 'Project created', data: projectToTrigger},
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
    var {data: updatedProject, error: dbError} = await supabase.from("projects")
        .update({
            description: project.description,
            repo_url: project.repo_url,
            container_port: `${project.container_port}`,
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

    if (updatedProject && updatedProject.length == 1) {
        updatedProject = updatedProject[0]
    }
    let projectToTrigger = GetProjectSchema.validate(updatedProject).value

    // Trigger redeploy workflow
    const triggerResponse = await trigger.deploy({
        container_port: `${projectToTrigger.container_port}`,
        entrypoint: projectToTrigger.entrypoint,
        host_port: `${projectToTrigger.host_port}`,
        project_name: projectToTrigger.project_name,
        repo_url: projectToTrigger.repo_url
    })

    if (!triggerResponse.isSuccess) {
        console.log(`ERROR: ${triggerResponse.error}`)
        return NextResponse.json(
            {
                message: `Project updated but redeploy trigger failed ERROR: ${triggerResponse.message}`,
                data: projectToTrigger
            },
            {status: 500}
        )
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
    var {data: deletedProject, error: dbError} = await supabase.from("projects")
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

    if (deletedProject && deletedProject.length == 1) {
        deletedProject = deletedProject[0]
    }
    let projectToTrigger = GetProjectSchema.validate(deletedProject).value

    // Trigger delete branch and destroy infra workflow
    const triggerResponse = await trigger.deleteAndDestroy({
        project_name: projectToTrigger.project_name,
    })

    if (!triggerResponse.isSuccess) {
        console.log(`ERROR: ${triggerResponse.error}`)
        return NextResponse.json(
            {
                message: `Project deleted but destroy trigger failed ERROR: ${triggerResponse.message}`,
                data: projectToTrigger
            },
            {status: 500}
        )
    }

    // Return response
    console.error('Project soft deleted:', deletedProject);
    return NextResponse.json(
        {message: 'Project deleted', data: projectToTrigger},
        {status: 201}
    )
}
