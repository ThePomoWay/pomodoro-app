#!/bin/bash

git pull origin master
GENERATE_SOURCEMAP=false
npm run build

aws s3 sync ./build s3://pomo-frontend/