
echo "$*"
PROJ="$1"
DEVPACKAGE="$2"
TEMPLATE="$3"

if [ -z "$PROJ" ] || [ -z "$DEVPACKAGE" ]
then
  echo "Please provide a App Name"
  echo "Please provide a App Name"
  echo "Usage ./projGenerator.sh <APP NAME> <Dev package Folder>"
  exit 1
else 
  echo "Project Directory is $PROJ"
fi

echo "Creating Directory for ../../$PROJ"
mkdir -p ../../"$PROJ"/"$PROJ"

echo "Template Directory is $TEMPLATE"
echo "Copying Template Application Files to ../../$PROJ"
cp -R $TEMPLATE/Assets.xcassets ../../"$PROJ"/"$PROJ"
cp -R $TEMPLATE/Info.plist ../../"$PROJ"/"$PROJ"
cp -R $TEMPLATE/LaunchScreen.storyboard ../../"$PROJ"/"$PROJ"
cp -R $TEMPLATE/Podfile ../..

echo "Copy google service"
cp "$DEVPACKAGE"/"GoogleService-Info.plist" ../../"$PROJ"/"$PROJ"

echo "Copy project template"
cp $TEMPLATE/project.yml ../../"$PROJ"

echo "Copy mconfig $DEVPACKAGE"
cp "$DEVPACKAGE"/mconfig.json ../../"$PROJ"

echo "Copy fastlane scripts"
cp -R $TEMPLATE/fastlane ../..

echo "Copy app icon and the other logo image"
cp "$DEVPACKAGE"/"App Icon - App Store.png" ../../"$PROJ"/"$PROJ"/Assets.xcassets/AppIcon.appiconset/app_icon.png
cp "$DEVPACKAGE"/"Splash Logo.png"  ../../"$PROJ"/"$PROJ"/Assets.xcassets/splash_logo.imageset/splash_logo.png
