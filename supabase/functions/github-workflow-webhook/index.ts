// import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.24.0'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
}

function determineDeploymentState(action: string, conclusion: string | null, workflowName: string): string {
    const normalizedWorkflowName = workflowName.toLowerCase();
    if (action === 'queued' || action === 'requested') {
        return normalizedWorkflowName.includes('deploy') ? 'DEPLOY_PENDING' : 'DESTROY_PENDING';
    } else if (action === 'in_progress') {
        return normalizedWorkflowName.includes('deploy') ? 'DEPLOYING' : 'DESTROYING';
    } else if (action === 'completed') {
        if (conclusion === 'success') {
            return normalizedWorkflowName.includes('deploy') ? 'DEPLOYED' : 'DESTROYED';
        } else {
            return normalizedWorkflowName.includes('deploy') ? 'DEPLOY_FAILED' : 'DESTROY_FAILED';
        }
    } else {
        return 'UNKNOWN';
    }
}

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {headers: corsHeaders})
    }

    if (req.body) {
        const body = await req.json();

        const workflowData = body.workflow_job || body.workflow_run;

        if (!workflowData) {
            console.error('No workflow_job or workflow_run found in the payload');
            return new Response('Invalid request format', { status: 400 });
        }

        const action = body.action;
        const headBranch = workflowData.head_branch;
        const workflowName = workflowData.name;
        const conclusion = workflowData.conclusion;
        const htmlUrl = workflowData.html_url;

        const deploymentState = determineDeploymentState(action, conclusion, workflowName);

        console.log(JSON.stringify({ headBranch, deploymentState, htmlUrl }, null, 2))
        return new Response('Processing successful', { status: 200 });

    }
});
//
// Deno.serve(async (req: Request) => {
//
//     if (req.method === 'OPTIONS') {
//         return new Response('ok', {headers: corsHeaders})
//     }
//
//     if (req.body) {
//         const body = await req.json();
//         console.log("Body:", body);
//         return new Response(JSON.stringify(body, null, 0), {status: 200})
//     }

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
// })
