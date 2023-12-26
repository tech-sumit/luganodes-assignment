# Grafana + loki + promtail monitoring setup for logs streaming

Loki datasource host: http://loki:3100

1. Install Loki log driver plugin
    ```bash
    $ docker plugin install grafana/loki-docker-driver:latest --alias loki --grant-all-permissions
    ```
2. Create daemon.json to set loki as default logging driver 
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
   then restart docker daemon
   ![daemon_json.png](..%2Fdocs%2Fdaemon_json.png)
3. Copy logStackSetup on EC2 & start docker compose stack
    ```bash
    $ docker compose up -d
    ```
4. Goto grafana host 
5. Add new Datasource; select Loki and put datasource host to be http://loki:3100
6. To explore logs go to Explore in Left menu and put container name or query like `{container_name="logger"} |= `

## Nginx conf to expose grafana on domain; websocket support added to enable log streaming on next app
```text
server {
    listen 80;
    listen [::]:80;

    server_name www.logs.bazzarapp.in logs.bazzarapp.in;

    access_log  /var/log/nginx/logs.bazzarapp.in/access.log;
    error_log  /var/log/nginx/logs.bazzarapp.in/error.log;

    location / {
       proxy_set_header Host $http_host;
       proxy_pass http://0.0.0.0:3030;
    }

    location /api {
       rewrite  ^/(.*)  /$1 break;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "Upgrade";
       proxy_set_header Host $http_host;
       proxy_pass http://127.0.0.1:3030/; # Proxy to Grafana server
    }

    location /lokiapi/ {
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "Upgrade";
       proxy_set_header Host $http_host;
       proxy_pass http://localhost:3100/;  # Proxy to Loki server
    }
}
```

Enable logs website with following command
```bash
$ sudo ln -s /etc/nginx/sites-available/logs.bazzarapp.in /etc/nginx/sites-enabled/

```
