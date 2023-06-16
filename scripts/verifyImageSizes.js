const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

(async () => {
    var myArgs = process.argv.slice(2);
    const packageName = myArgs[0];
    
    var appStoreLogoLocation =  path.join(packageName, "App Icon - App Store.png");
    var appStoreLogoDimensions = sizeOf(appStoreLogoLocation);
    if (appStoreLogoDimensions.width != 1024 || appStoreLogoDimensions.height != 1024) {
        console.log("Incorrect app store image size", appStoreLogoDimensions);
        throw "Incorrect app store image size";
    }
    
    console.log("Verifying splash logo icon");
    var splashLogoLocation =  path.join(packageName, "Splash Logo.png");
    var splashLogoDimensions = sizeOf(splashLogoLocation);
    if (splashLogoDimensions.height/3 != 48) {
        console.log("Incorrect splash logo image size", splashLogoDimensions);
        throw "Incorrect splash logo image size";
    }
})();
