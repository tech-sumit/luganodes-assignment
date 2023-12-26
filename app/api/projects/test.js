const { Octokit } = require("octokit");


async function test(owner,repo,branch,project_name,token){
    const octokit = new Octokit({auth: token});
    // Get the latest commit SHA of the base branch
    const {data: refData} = await octokit.request('GET /repos/{owner}/{repo}/git/ref/heads/{branch}', {
        owner: owner,
        repo: repo,
        branch: branch
    });
    console.log("refData: ",JSON.stringify(refData))
    const sha = refData.object.sha;

    // Create a new branch using the latest commit SHA
    const refs=await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
        owner: owner,
        repo: repo,
        ref: `refs/heads/${project_name}`,
        sha
    });
    console.log("refs: ",JSON.stringify(refs))
    // var resp=await octokit.request('DELETE /repos/{owner}/{repo}/git/refs/heads/{branch}', {
    //     owner: owner,
    //     repo: repo,
    //     branch: project_name
    // });
    //
    // console.log(JSON.stringify(resp,null,2));
    // console.log(`Branch '${project_name}' deleted successfully`);
}

(async ()=>{
    await test('tech-sumit','luganodes-assignment','main','programatic','github_pat_11APMDQ2Q0hbRue1g6urNc_cYUr2PErMeh57raM4CE7pZl4hNBfhIYz8tSQ7rH0svqT7FAKE5M7MrAVJqU')
})()
