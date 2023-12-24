import { Octokit } from "@octokit/core";

async function triggerWorkflowDispatch() {
    const octokit = new Octokit({ auth: "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" });

    const owner = "tech-sumit";
    const repo = "luganodes-assignment";
    const workflow_id = "ec2_application_deploy.yml"
    const ref = "main"; // e.g., "main"

    const inputs = {
        repo_url: "tech-sumit/luganodes-assignment",
        project_name: "luganodes-assignment",
        user_name: "tech-sumit",
        random_host_port: "8080",
        container_port: "3000",
        // Add other inputs as needed
    };

    try {
        await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
            owner,
            repo,
            workflow_id,
            ref,
            inputs
        });
        console.log('Workflow dispatch triggered successfully.');
    } catch (error) {
        console.error('Error triggering workflow:', error);
    }
}

triggerWorkflowDispatch();
