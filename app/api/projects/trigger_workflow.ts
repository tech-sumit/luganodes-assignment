import {Octokit} from "@octokit/core";

type DeployWorkflowInput = {
    repo_url: string
    project_name: string
    host_port: string
    container_port: string
    entrypoint_array: string
}

type DestroyWorkflowInput = {
    project_name: string
}

enum Workflows {
    Deploy = ".github/workflows/ec2_application_deploy.yml",
    Destroy = ".github/workflows/ec2_application_destroy.yml"
}

type TriggerResponse = Promise<{
    isSuccess: boolean
    message: string
    error?: string
}>;

async function triggerWorkflowDispatch(token: string, owner: string, repo: string, workflow_name: Workflows, branch: string, inputs: DeployWorkflowInput | DestroyWorkflowInput): TriggerResponse {
    const octokit = new Octokit({auth: token});
    const url = 'POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches'
    try {
        let response = await octokit.request(url, {
            owner,
            repo,
            workflow_id: workflow_name,
            ref: branch,
            inputs
        });
        console.log('Workflow dispatch triggered successfully.');
        if (response.status == 204) {
            return {isSuccess: true, message: 'Workflow dispatched successfully.'};
        } else {
            return {isSuccess: false, message: 'Workflow dispatch unsuccessful.'};
        }
    } catch (error) {
        return {isSuccess: false, message: 'Workflow dispatch unsuccessful.', error: "" + error};
    }
}

class TriggerWorkflow {
    token: string;
    owner: string;
    repo: string;
    branch: string;

    constructor(token: string, owner: string, repo: string, branch: string = "main") {
        this.token = token;
        this.owner = owner;
        this.repo = repo;
        this.branch = branch;
    }

    async deploy(input: DeployWorkflowInput) {
        return triggerWorkflowDispatch(this.token, this.owner, this.repo, Workflows.Deploy, this.branch, input)
    }

    async destroy(input: DestroyWorkflowInput) {
        return triggerWorkflowDispatch(this.token, this.owner, this.repo, Workflows.Destroy, this.branch, input)
    }
}
