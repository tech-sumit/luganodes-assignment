# luganodes-assignment


# Github EC2 deployment workflows

Sample Docker file to be added and the deployment workflow

Use this repo to test deploy with Dockerfile present case
https://github.com/Shaharyar07/Dummy-Server-Node-Express

Use this repo to test deploy without Dockerfile present case
https://github.com/heroku/node-js-sample

# Install EC2 requirements

```bash
sudo apt update
sudo apt install nginx
sudo apt install jq
```

## Workflow requirements

Workflow's dynamic inputs
```yaml
      repo_url:
        description: 'Repository URL'
        required: true
      project_name:
        description: 'Project Name'
        required: true
      host_port:
        description: 'Host Port'
        required: true
      container_port:
        description: 'Container Port'
        required: true
      entrypoint:
        description: 'Entrypoint Array (JSON format)'
        required: false
      envs:
        description: 'Environment variables'
        required: false
```

Required github Secrets
```dotenv
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
ECR_REPOSITORY_URL

SSH_HOST
SSH_USERNAME
SSH_KEY
```
