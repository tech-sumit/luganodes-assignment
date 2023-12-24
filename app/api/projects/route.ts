// This file handles GET requests to /api/projects/[id]
import {createClient} from '@/utils/supabase/server';
import {cookies} from "next/headers";
import {NextApiRequest, NextApiResponse} from "next";
import {NextResponse} from "next/server";
import {CreateProjectSchema, GetProjectSchema} from "@/app/models/project";

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(req: NextApiRequest) {
    console.log(req.query)
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);

    const {data} = await supabase.from("projects").select();

    return NextResponse.json(
        {message: 'Projects fetched', data: GetProjectSchema.validate(data).value},
        {status: 200}
    )
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    // Authenticate session
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);

    // Validate request
    let {error: validationError, value: project} = CreateProjectSchema.validate(req.body)
    if (validationError) {
        return NextResponse.json({error: validationError}, {status: 400})
    }

    // Add a new project
    const {data: newProject, error: dbError} = await supabase.from("projects")
        .insert([project])
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
