// @ts-ignore
import {createClient} from 'https://esm.sh/@supabase/supabase-js'

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

// @ts-ignore
Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {headers: corsHeaders})
    }

    if (req.body) {
        const body = await req.json();
        const workflowData = body.workflow_job || body.workflow_run;
        if (!workflowData) {
            console.error('No workflow_job or workflow_run found in the payload');
            return new Response('Invalid request format', {status: 400});
        }

        const action = body.action;
        const headBranch = workflowData.head_branch;
        const workflowName = workflowData.name;
        const conclusion = workflowData.conclusion;

        const deploymentState = determineDeploymentState(action, conclusion, workflowName);

        const supabase = createClient(
            // @ts-ignore
            Deno.env.get('SUPABASE_URL') ?? '',Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        await supabase.from("projects")
            .update({deployment_state: deploymentState})
            .eq('project_name', headBranch)
            .select();
        return new Response('Processing successful', {status: 200});
    }
});
