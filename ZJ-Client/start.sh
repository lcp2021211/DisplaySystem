#!/bin/bash
pm2 start 'ng serve --host 0.0.0.0 --live-reload false' --name Client
pm2 save
pm2 startup
