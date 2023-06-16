#!/bin/bash

echo "$*"
BRANCH="$1"
PROJECTNAME="$2"
ITCTEAMID="$3"
TEMPLATE="TemplateAppFiles"
if [ -z "$BRANCH" ]
then
  echo "Usage ./projGenerator.sh <branch NAME>"
  exit 1
else 
  echo "Running script on branch: release/$BRANCH"
fi

git checkout release/"$BRANCH"
git pull

git checkout raj/experimental-automation TemplateAppFiles/fastlane/ Gemfile
# temp files that are needed
git checkout raj/experimental-automation itc-connect.json editFastlane.js project-names.json apple-ids.json

echo "copy in the fastlane templates"
cp -R $TEMPLATE/fastlane .

# run the fastlane file edit script
node editFastlane.js "$BRANCH"

rm -rf itc-connect.json editFastlane.js project-names.json apple-ids.json

git add apps/
git add TemplateAppFiles/fastlane/
git add fastlane/
git add itc-connect.json editFastlane.js project-names.json apple-ids.json

# git commit -m "fastlane configuration update"
# git push
