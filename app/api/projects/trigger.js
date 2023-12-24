const { Octokit } = require("@octokit/core");

async function triggerWorkflow(owner, repo, workflow_id, ref, inputs) {
    const octokit = new Octokit({ auth: "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" });
    // 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
    // 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
    try {
        const response = await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
            owner: owner,
            repo: repo,
            workflow_id: workflow_id,
            ref: ref,
            inputs: inputs,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        console.log('Workflow dispatch response:', response);
    } catch (error) {
        console.error('Error triggering workflow:', error);
    }
}

async function ListWorkflows(){

    const octokit = new Octokit({
        auth: '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'
    })
    const owner = "tech-sumit";
    const repo = "luganodes-assignment";

    let resp=await octokit.request('GET /repos/{owner}/{repo}/actions/workflows', {
        owner: owner,
        repo: repo,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    console.log(JSON.stringify(resp,0,2))
}

// Usage
//DEPLOY: 80307275
//DESTROY: 80307276
const owner = "tech-sumit";
const repo = "luganodes-assignment";
const workflow_id = "80307275";
const ref = "main";

const inputs = {
    repo_url: "Shaharyar07/Dummy-Server-Node-Express",
    project_name: "Dummy-Server-Node-Express",
    user_name: "sumit",
    host_port: "3210",
    container_port: "3000",
    entrypoint_array:`["node","index.js"]`
};

triggerWorkflow(owner, repo, workflow_id, ref, inputs);

// ListWorkflows()
