# luganodes-assignment


# Github EC2 deployment workflows

Sample Docker file to be added and the deployment workflow

Use this repo to test deploy with Dockerfile present case
https://github.com/Shaharyar07/Dummy-Server-Node-Express

Use this repo to test deploy without Dockerfile present case
https://github.com/heroku/node-js-sample
https://github.com/winstonjs/winston

# Install EC2 requirements

```bash
sudo apt update
sudo apt install nginx
sudo apt install jq
```

## Add line to Nginx.conf
This is to support long subdomain names
![update_nginx_conf.png](docs%2Fupdate_nginx_conf.png)

## Setup DNS record 
Add A DNS record in Domain provider settings
![add_a_record_in_domain_dns.png](docs%2Fadd_a_record_in_domain_dns.png)

## Workflow requirements

These are the variables the workflow takes as input to clone, build and run the source code
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

## Required github Secrets
Add following variables to github's repository secrets to enable complete workflow functionality

| Secret Name            | Value (What to put inside)                                                 |
|------------------------|----------------------------------------------------------------------------|
| `AWS_ACCESS_KEY_ID`    | `Your AWS Access Key ID`                                                   |
| `AWS_SECRET_ACCESS_KEY`| `Your AWS Secret Access Key`                                               |
| `AWS_REGION`           | `AWS Region`                                                               |
| `ECR_REPOSITORY_URL`   | `ECR / Image Repository URL`                                               |
|                        |                                                                            |
| `SSH_HOST`             | `EC2 Host`                                                                 |
| `SSH_USERNAME`         | `EC2 SSH access username`                                                  |
| `SSH_KEY`              | `EC2 instance's SSH Key`                                                   |
| `SSH_PRIVATEKEY`       | `EC2 SSH Private Key for unattended access`                                |
|                        |                                                                            |
| `GH_API_TOKEN`         | `GitHub access Token with workflow and repository full access permissions` |
| `SERVER_DOMAIN`        | `Server Domain (ex. bazzarapp.in)`                                         |

## Running the container
Run following command with all envs passed
```bash
docker run -p 3000:3000 \
-e NEXT_PUBLIC_SUPABASE_URL=https://nmgklmsdzbdruerlwuop.supabase.co \
-e NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZ2tsbXNkemJkcnVlcmx3dW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMwOTQ2MjYsImV4cCI6MjAxODY3MDYyNn0.tqvtnPsVHGRVIRtXt5LKBZHzd6ABBqlm_KZYzMRQzMc \
-e NEXT_PRIVATE_SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZ2tsbXNkemJkcnVlcmx3dW9wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMzA5NDYyNiwiZXhwIjoyMDE4NjcwNjI2fQ.FqUQEaqHMftK48GP1ei60VfCBUmmkGtavu1jNHq74I8 \
-e GITHUB_TOKEN=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 \
-e REPO_OWNER=tech-sumit \
-e REPO_NAME=luganodes-assignment \
-e DEFAULT_BRANCH=main \
-e LOGS_WEBSOCKET_HOST=ws://logs.bazzarapp.in/lokiapi \
420610997961.dkr.ecr.ap-south-1.amazonaws.com/projects:luganodes-assignment

```

