#!/bin/bash
# git add $process.argv[0]
# git commit -m $process.argv[1]
# git push

read -p "Enter fileName to add: " fileName
git add fileName
read -p "Enter commit message: " message
git commit -m message
git push