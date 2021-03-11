# 更新日志
2021-02-04 下午 增加细粒度权限控制

# 部署方式：

###Nginx:

    server {
            listen 8848;
    
            root /var/tendim/manager/dist;
            index index.html index.htm;
    
            location / {
                    try_files $uri $uri/ /index.html;
            }
            location ^~ /assets/ {
                    gzip_static on;
                    expires max;
                    add_header Cache-Control public;
            }
             location ^~ /api/ {
              proxy_pass http://127.0.0.1:8080;
            }
            error_page 500 502 503 504 /500.html;
            client_max_body_size 20M;
            keepalive_timeout 10;
    } 
