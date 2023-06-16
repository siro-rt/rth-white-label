echo "$*"
DEVPACKAGE="$1"

if [ -z "$DEVPACKAGE" ]
then
  echo "Please provide a dev package"
  echo "Usage ./checkDevPackage.sh <Dev package Folder>"
  exit 1
else 
  echo "Dev package directory is $DEVPACKAGE"
fi

packagecontents=(
  "App Icon - App Store.png"
  "GoogleService-Info.plist"
  "Splash Logo.png"
  "mconfig.json"
)

for i in "${packagecontents[@]}"
do
  if [ ! -e "$DEVPACKAGE/$i" ]; then
    echo "$i does not exist"
    exit 1
  fi
done
