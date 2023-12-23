import {createClient} from '@/utils/supabase/server';
import {cookies} from 'next/headers';
import {NextRequest, NextResponse} from 'next/server'

export const dynamic = 'force-dynamic'

export default async function GetAllProjects(){
    'use server'
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const {data: projects} = await supabase.from("projects").select();

    return projects
}

export async function POST(request: NextRequest) {
}

export async function PUT(request: NextRequest) {
}

export async function DELETE(request: NextRequest) {
}

export async function PATCH(request: NextRequest) {
}
