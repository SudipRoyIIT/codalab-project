#!/bin/bash
export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.5.0/bin

cd  Backend
sudo git pull origin main
cd src
pm2 kill 
pm2 start index.js
