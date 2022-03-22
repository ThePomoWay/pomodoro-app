#!/bin/bash

git pull origin master
npm run build

aws s3 sync ./build s3://pomo-frontend/