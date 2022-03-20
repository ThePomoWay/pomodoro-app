#!/bin/bash

git pull origin master
npm run build

aws sync ./build s3://pomo-frontend/