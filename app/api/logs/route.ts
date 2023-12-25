import {type NextRequest, NextResponse} from 'next/server'
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(req: NextRequest) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const {data: {session}} = await supabase.auth.getSession()
}
