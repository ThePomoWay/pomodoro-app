#!/bin/bash

git pull origin master
npm run build
scp -i ../Akash-Pomo.cer -r ./build/*  ec2-user@15.207.108.108:~/build

ssh ec2-user@15.207.108.108 -i ../Akash-Pomo.cer "sudo rm -rf /var/www/pomo-frontend-beta && sudo mkdir /var/www/pomo-frontend-beta/ && sudo mv build/* /var/www/pomo-frontend-beta/"