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

interface CreateBranchInput {
    project_name: string;
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
    const response = await octokit.request(url, {
        owner,
        repo,
        workflow_id: workflow_name,
        ref: branch,
        inputs
    });

    if (response.status == 204) {
        return {isSuccess: true, message: `Workflow ${workflow_name} dispatched successfully.`};
    } else {
        return {isSuccess: false, message: `Workflow ${workflow_name} dispatch unsuccessful.`, error: response.data};
    }
}

export default class TriggerWorkflow {
    token: string;
    owner: string;
    repo: string;

    constructor(token: string, owner: string, repo: string) {
        this.token = token;
        this.owner = owner;
        this.repo = repo;
    }

    async deploy(input: DeployWorkflowInput) {
        return triggerWorkflowDispatch(this.token, this.owner, this.repo, Workflows.Deploy, input.project_name, input)
    }

    async destroy(input: DestroyWorkflowInput) {
        return triggerWorkflowDispatch(this.token, this.owner, this.repo, Workflows.Destroy, input.project_name, input)
    }

    async createBranch(input: CreateBranchInput): TriggerResponse {
        const octokit = new Octokit({auth: this.token});
        // Get the latest commit SHA of the base branch
        // SUCCESS code 200
        const {data: refData} = await octokit.request('GET /repos/{owner}/{repo}/git/ref/heads/{branch}', {
            owner: this.owner,
            repo: this.repo,
            branch: input.project_name
        });
        const sha = refData.object.sha;

        // Create a new branch using the latest commit SHA
        // SUCCESS code 201
        const response = await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
            owner: this.owner,
            repo: this.repo,
            ref: `refs/heads/${input.project_name}`,
            sha
        });

        if (response.status == 201) {
            console.log(`Branch '${input.project_name}' created successfully`);
            return {isSuccess: true, message: `Branch '${input.project_name}' created successfully`};
        } else {
            return {isSuccess: false, message: 'Branch creation unsuccessful.', error: JSON.stringify(response.data)};
        }
    }

    async deleteBranch(project_name: string): TriggerResponse {
        const octokit = new Octokit({auth: this.token});
        // SUCCESS code 204
        const response = await octokit.request('DELETE /repos/{owner}/{repo}/git/refs/heads/{branch}', {
            owner: this.owner,
            repo: this.repo,
            branch: project_name
        });

        if (response.status == 204) {
            console.log(`Branch '${project_name}' deleted successfully`);
            return {isSuccess: true, message: `Branch '${project_name}' deleted successfully`};
        } else {
            return {isSuccess: false, message: 'Branch deletion unsuccessful.',error: JSON.stringify(response.data)};
        }
    }

    // Function to create a branch and trigger deploy
    async createAndDeploy(input: DeployWorkflowInput): TriggerResponse {
        try {
            // Create the branch
            const createBranchResponse = await this.createBranch(input);
            if (!createBranchResponse.isSuccess) {
                return createBranchResponse;
            }

            // Deploy
            return this.deploy(input);
        } catch (error) {
            return {isSuccess: false, message: 'Error in create and deploy', error: "" + error};
        }
    }

    // Function to delete a branch and trigger destroy
    async deleteAndDestroy(input: DestroyWorkflowInput): TriggerResponse {
        try {
            // Delete the branch
            const deleteBranchResponse = await this.deleteBranch(input.project_name);
            if (!deleteBranchResponse.isSuccess) {
                return deleteBranchResponse;
            }

            // Destroy
            return this.destroy(input);
        } catch (error) {
            return {isSuccess: false, message: 'Error in delete and destroy', error: "" + error};
        }
    }
}
