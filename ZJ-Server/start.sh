# supervisor bin/www
pm2 start 'npm start' --name Server
pm2 save
pm2 startup