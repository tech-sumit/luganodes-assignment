# Grafana + loki + promtail monitoring setup for logs streaming

Loki datasource host: http://loki:3100

1. Install Loki log driver plugin
    ```bash
    $ docker plugin install grafana/loki-docker-driver:latest --alias loki --grant-all-permissions
    ```
2. Create daemon.json to set loki as default looging driver 
    ```bash
    $ cat daemon.json
    {
       "log-driver": "loki",
       "log-opts": {
           "loki-url": "http://localhost:3100/loki/api/v1/push",
           "loki-batch-size": "400",
           "loki-external-labels": "job=docker,container_name={{.Name}}"
       }
    }
    ```
3. Copy logStackSetup on EC2 & start docker compose stack
    ```bash
    $ docker compose up -d
    ```
4. Goto grafana host 
5. Add new Datasource; select Loki and put datasource host to be http://loki:3100
6. To explore logs go to Explore in Left menu and put container name or query like `{container_name="logger"} |= `

## Nginx conf to expose grafana on domain
```text
server {
    listen 80;
    listen [::]:80;

    server_name www.logs.bazzarapp.in logs.bazzarapp.in;

    access_log  /var/log/nginx/hello.bazzarapp.in/access.log;
    error_log  /var/log/nginx/hello.bazzarapp.in/error.log;

    location / {
       proxy_set_header Host $http_host;
       proxy_pass http://0.0.0.0:3030;  # Proxy to Grafana server
    }

    location /lokiapi/ {
       proxy_set_header Host $http_host;
       proxy_pass http://localhost:3100/;  # Proxy to Loki server
    }
}
```
