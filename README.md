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

###关于给JS/CSS优化:

##### 文件：/etc/nginx/nginx.conf
    
    http {
       .....
       # 开启优化
       gzip                on;
       #低于1kb的资源不压缩，
       gzip_min_length     1024;
       #压缩级别【1-9】，越大压缩率越高，同时消耗cpu资源也越多，建议设置在4左右
       gzip_comp_level     3;
       #需要压缩哪些响应类型的资源，多个空格隔开。不建议压缩图片
       gzip_types         text/plain application/x-javascript application/javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
       #配置禁用gzip条件，支持正则。此处表示ie6及以下不启用gzip（因为ie低版本不支持）
       gzip_disable "MSIE [1-6]\.";
       #是否添加“Vary: Accept-Encoding”响应头
       gzip_vary off;
       ........
    }

##### 测试

    curl -I -H "Accept-Encoding: gzip, deflate" "http://base.tyuan.design:81/umi.e756b848.js"
    HTTP/1.1 200 OK
    Server: nginx/1.16.1
    Date: Fri, 19 Mar 2021 08:14:17 GMT
    Content-Type: application/javascript
    Last-Modified: Fri, 19 Mar 2021 04:59:34 GMT
    Connection: keep-alive
    ETag: W/"60542fb6-1e7709"
    Expires: Thu, 31 Dec 2037 23:55:55 GMT
    Cache-Control: max-age=315360000
    Cache-Control: public
    Content-Encoding: gzip   <------ 返回则代表配置成功
