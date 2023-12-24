# luganodes-assignment


# Github EC2 deployment workflows

Sample Docker file to be added and the deployment workflow

Use this repo to test deploy with Dockerfile present case
https://github.com/Shaharyar07/Dummy-Server-Node-Express

Use this repo to test deploy without Dockerfile present case
https://github.com/heroku/node-js-sample

## Workflow requirements
Workflow's dynamic inputs
```yaml
      repo_url:
        description: 'Repository URL'
        required: true
      project_name:
        description: 'Project Name'
        required: true
      user_name:
        description: 'User Name'
        required: true
      random_host_port:
        description: 'Random Host Port'
        required: true
      container_port:
        description: 'Container Port'
        required: true
      entrypoint_array:
        description: 'Entrypoint Array (JSON format)'
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
