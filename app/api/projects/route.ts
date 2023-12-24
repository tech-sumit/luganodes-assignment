import {createClient} from '@/utils/supabase/server';
import {cookies} from "next/headers";
import {CreateProjectSchema, GetProjectSchema} from "@/app/models/project";
import {NextRequest, NextResponse} from "next/server";

import type {Database} from '@/lib/database.types'

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(req: NextRequest) {
    console.log(req.nextUrl.searchParams)
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const {data: {session}} = await supabase.auth.getSession()

    const {data} = await supabase.from("projects").select().eq('user_id',session?.user.id);

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
    project.user_id=session?.user.id

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
