// import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.24.0'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
}

Deno.serve(async (req: Request) => {

    if (req.method === 'OPTIONS') {
        return new Response('ok', {headers: corsHeaders})
    }

    if (req.body) {
        const body = await req.json();
        console.log("Body:", body);
        return new Response(JSON.stringify(body, null, 0), {status: 200})
    }

    // try {
    //     let SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
    //     let SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    //
    //
    //     const supabaseClient = createClient(
    //         SUPABASE_URL,
    //         SUPABASE_ANON_KEY,
    //     )
    //
    //     // And we can run queries in the context of our authenticated user
    //     const {data, error} = await supabaseClient.from('projects').select('*')
    //     if (error) throw error
    //
    //     return new Response(JSON.stringify({data}), {
    //         headers: {...corsHeaders, 'Content-Type': 'application/json'},
    //         status: 200,
    //     })
    // } catch (error) {
    //     return new Response(JSON.stringify({error: error}), {
    //         headers: {...corsHeaders, 'Content-Type': 'application/json'},
    //         status: 400,
    //     })
    // }
})
