import {Octokit} from "@octokit/core";

type DeployWorkflowInput = {
    repo_url: string
    project_name: string
    host_port: string
    container_port: string
    entrypoint: string
    envs: string
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
    branch?: string

    constructor(token: string, owner: string, repo: string, branch: string = "main") {
        this.token = token;
        this.owner = owner;
        this.repo = repo;
        this.branch = branch
    }

    async deploy(input: DeployWorkflowInput) {
        return triggerWorkflowDispatch(this.token, this.owner, this.repo, Workflows.Deploy, input.project_name, input)
    }

    async destroy(input: DestroyWorkflowInput) {
        return triggerWorkflowDispatch(this.token, this.owner, this.repo, Workflows.Destroy, input.project_name, input)
    }

    async createUpdateBranch(input: CreateBranchInput): TriggerResponse {
        const octokit = new Octokit({auth: this.token});

        // Get the latest commit SHA of the base branch
        const {data: refData} = await octokit.request('GET /repos/{owner}/{repo}/git/ref/heads/{branch}', {
            owner: this.owner,
            repo: this.repo,
            branch: this.branch
        });
        const sha = refData.object.sha;

        // Try to create a new branch using the latest commit SHA
        const createResponse = await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
            owner: this.owner,
            repo: this.repo,
            ref: `refs/heads/${input.project_name}`,
            sha
        });

        if (createResponse.status === 201) {
            console.log(`Branch '${input.project_name}' created successfully`);
            return {isSuccess: true, message: `Branch '${input.project_name}' created successfully`};
        } else if (createResponse.status === 422) {
            // Branch already exists, update its head
            const updateResponse = await octokit.request('PATCH /repos/{owner}/{repo}/git/refs/heads/{branch}', {
                owner: this.owner,
                repo: this.repo,
                branch: input.project_name,
                sha,
                force: true
            });

            if (updateResponse.status === 200) {
                console.log(`Branch '${input.project_name}' updated successfully`);
                return {isSuccess: true, message: `Branch '${input.project_name}' updated successfully`};
            } else {
                return {
                    isSuccess: false,
                    message: 'Branch update unsuccessful.',
                    error: JSON.stringify(updateResponse.data)
                };
            }
        } else {
            return {
                isSuccess: false,
                message: 'Branch creation or update unsuccessful.',
                error: JSON.stringify(createResponse)
            };
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
            return {isSuccess: false, message: 'Branch deletion unsuccessful.', error: JSON.stringify(response.data)};
        }
    }

    // Function to create a branch and trigger deploy
    async createAndDeploy(input: DeployWorkflowInput): TriggerResponse {
        try {
            // Create the branch
            const createBranchResponse = await this.createUpdateBranch(input);
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
            // Destroy
            const destroyResponse = await this.destroy(input);
            if (!destroyResponse.isSuccess) {
                return destroyResponse;
            }

            // Delete the branch
            return await this.deleteBranch(input.project_name);
        } catch (error) {
            return {isSuccess: false, message: 'Error in delete and destroy', error: "" + error};
        }
    }
}
