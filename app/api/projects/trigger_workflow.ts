import { Octokit } from "@octokit/core";

async function triggerWorkflowDispatch() {
    const octokit = new Octokit({ auth: "<your_github_token>" });

    const owner = "<your_github_username_or_org>";
    const repo = "<your_repository_name>";
    const workflow_id = "<workflow_file_name.yml>"; // e.g., "deploy.yml"
    const ref = "<branch>"; // e.g., "main"

    const inputs = {
        repo_url: "https://github.com/example/repo",
        project_name: "example_project",
        user_name: "example_user",
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
