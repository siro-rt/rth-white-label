#!/bin/bash

echo "$*"
PROJECTNAME="$1"
DEVPACKAGE="$2"
TEMPLATE="$3"
BRANCHNAME="$4"
VERSIONCODE="$5"
RELEASENAME="$6"

echo "Verifying the required parameters"
if [ -z "$PROJECTNAME" ] || [ -z "$DEVPACKAGE" ] || [ -z "$BRANCHNAME" ] || [ -z "$VERSIONCODE" ] || [ -z "$RELEASENAME" ]
then
  echo "Please provide a project name (no spaces), devpackage, branch name, and version code"
  echo "Usage ./buildWhiteLabel.sh <PROJECTNAME> <DEVPACKAGE> <branch name> <version code (YY.MM.DD)>"
  exit 1
else 
  echo "Project: $PROJECTNAME Dev Package: $DEVPACKAGE"
fi

echo "Stash existing changes to avoid aborting error"
git stash

echo "Checkout new/existing branch"
git checkout -b "$RELEASENAME"/"$BRANCHNAME" || git checkout "$RELEASENAME"/"$BRANCHNAME"

echo "Validate all the assets and config files in the given package"
./checkDevPackage.sh "$DEVPACKAGE"

echo "Validate all the images"
node verifyImageSizes "$DEVPACKAGE"

echo "Move config files to its appropriate paths"
chmod +x ./projGenerator.sh
./projGenerator.sh "$PROJECTNAME" "$DEVPACKAGE" "$TEMPLATE"

echo "Replace placeholders with actual names and values"
node editFiles.js "$PROJECTNAME" "$VERSIONCODE"
node editFastlane.js "$BRANCHNAME"

echo "Replace custom colours in images"
node updateAssetColors.js "$PROJECTNAME"

echo "Generate xcodeproj using xcodegen tool"
cd ../../"$PROJECTNAME"
xcodegen generate

## this step is required because xcodegen overwrites the entitlements file and uses its own
## so this cant be done before xcodegen generates the entitlements
echo "Copy entitlement files"
cp ../whitelabel/template/"App Name.entitlements" "$PROJECTNAME"
mv "$PROJECTNAME"/"App Name.entitlements" "$PROJECTNAME"/"$PROJECTNAME".entitlements
node ../whitelabel/scripts/editEntitlements.js "$PROJECTNAME"

# Letting all modifying functions to complete before deleting/switching 
sleep 5

echo "Install pods from root folder"
cd ..
rm -rf RTHRefresher.xcworkspace
pod install

echo "Remove RouteThisHelps project, whitelabel files and scripts"
rm -rf RTHRefresh

echo "Commit the changes and push to the repo"
git add "$PROJECTNAME"/
git add RTHRefresh
git add whitelabel
git add Podfile Podfile.lock
git add RTHRefresher.xcworkspace/
git add fastlane
git commit -m "$PROJECTNAME new whitelabel"
git pull
git push -f --set-upstream origin "$RELEASENAME"/"$BRANCHNAME"