const { Octokit } = require("@octokit/core");

const token=""

async function triggerWorkflow(owner, repo, workflow_id, ref, inputs) {
    const octokit = new Octokit({ auth: token });
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
        auth: token
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
//DEPLOY: .github/workflows/ec2_application_deploy.yml
//DESTROY: .github/workflows/ec2_application_destroy.yml
const owner = "tech-sumit";
const repo = "luganodes-assignment";
const workflow_id = ".github/workflows/ec2_application_deploy.yml";
const ref = "main";

const inputs = {
    repo_url: "Shaharyar07/Dummy-Server-Node-Express",
    project_name: "Dummy-Server-Node-Express",
    user_name: "sumit",
    host_port: "3210",
    container_port: "3000",
    entrypoint_array:`["node","index.js"]`
};

(async ()=>{
    await triggerWorkflow(owner, repo, workflow_id, ref, inputs);

    // await ListWorkflows()
})()
