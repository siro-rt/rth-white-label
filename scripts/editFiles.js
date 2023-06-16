const fs = require('fs');
const path = require('path');
const plist = require('plist');

(async () => {

    var myArgs = process.argv.slice(2);
    const projectName = myArgs[0];
    const versionCode = myArgs[1];
    const infoPlistFile = path.join(__dirname, '../..',projectName, projectName,'Info.plist');
    const mobileConfigFile = path.join(__dirname, '../..',projectName, "mconfig.json");
    const entitlementsFileName = projectName + '.entitlements'
    const entitlementsFile = path.join(__dirname, '../..',projectName, projectName, entitlementsFileName);
    const podfileFile = path.join(__dirname, "../..", "Podfile")
    const projectYMLFile = path.join(__dirname, '../..',projectName, "project.yml");
    const mobileConfig = JSON.parse(fs.readFileSync(mobileConfigFile, 'utf-8'));
    const appName = mobileConfig["mobileConfiguration"]["stringAppName"];
    
    // Info.plist file
    var infoPlistParsed = JSON.parse(JSON.stringify(plist.parse(fs.readFileSync(infoPlistFile, 'utf-8'))));
    infoPlistParsed.CFBundleDisplayName = appName;
    infoPlistParsed.CFBundleName = appName;
    infoPlistParsed.DefaultRouteThisCode = mobileConfig["mobileConfiguration"]["fourDigitCode"];
    infoPlistParsed.SelfHelpTheme = mobileConfig["mobileConfiguration"]["selfHelpTheme"];
    infoPlistParsed.UIStatusBarStyle = mobileConfig["mobileConfiguration"]["UIStatusBarStyle"];
    infoPlistParsed.imageSetToUse = mobileConfig["mobileConfiguration"]["imageSetToUse"];
    infoPlistParsed.CFBundleShortVersionString = versionCode;
    infoPlistParsed.CFBundleVersion = "1";
    infoPlistParsed.UIMainStoryboardFile = "LaunchScreen";
    infoPlistParsed.welcomeText = "Welcome to " + appName;
    
    // Set custom colours
    if (mobileConfig?.mobileConfiguration?.primaryColor) {
        infoPlistParsed["primaryColor"] = mobileConfig["mobileConfiguration"]["primaryColor"];
    }
    if (mobileConfig?.mobileConfiguration?.primaryTextColor) {
        infoPlistParsed["primaryTextColor"] = mobileConfig["mobileConfiguration"]["primaryTextColor"];
    }
    if (mobileConfig?.mobileConfiguration?.backgroundVariantColor) {
        infoPlistParsed["backgroundVariantColor"] = mobileConfig["mobileConfiguration"]["backgroundVariantColor"];
    }
    if (mobileConfig?.mobileConfiguration?.backgroundVariantTextColor) {
        infoPlistParsed["backgroundVariantTextColor"] = mobileConfig["mobileConfiguration"]["backgroundVariantTextColor"];
    }
    if (mobileConfig?.mobileConfiguration?.errorColor) {
        infoPlistParsed["errorColor"] = mobileConfig["mobileConfiguration"]["errorColor"];
    }
    if (mobileConfig?.mobileConfiguration?.successColor) {
        infoPlistParsed["successColor"] = mobileConfig["mobileConfiguration"]["successColor"];
    }
    if (mobileConfig?.mobileConfiguration?.warningColor) {
        infoPlistParsed["warningColor"] = mobileConfig["mobileConfiguration"]["warningColor"];
    }

    fs.writeFileSync(infoPlistFile, plist.build(infoPlistParsed), function writeJSON(err) {
        if (err) return console.log(err);
        console.log('writing new plist to: ' + infoPlistFile);
      });

    // Podfile
    var podfile = fs.readFileSync(podfileFile, 'utf-8');
    podfile = replaceAll(podfile,"[Project Name]",projectName);

    fs.writeFileSync(podfileFile, podfile, function (err) {
        if (err) return console.log(err);
        console.log('writing new podfile file to: ' + podfileFile);
    });

    
    // edit project yml
    projectYML = fs.readFileSync(projectYMLFile, 'utf-8');
    projectYML = replaceAll(projectYML,"[Project Name]",projectName);
    projectYML = replaceAll(projectYML,"[Prod Target Name]",mobileConfig["mobileConfiguration"]["prodBundle"]);
    projectYML = replaceAll(projectYML,"[Staging Target Name]",mobileConfig["mobileConfiguration"]["stagingBundle"]);
    projectYML = replaceAll(projectYML,"[Develop Target Name]",mobileConfig["mobileConfiguration"]["developBundle"]);
    projectYML = replaceAll(projectYML,"[Local Target Name]",mobileConfig["mobileConfiguration"]["localBundle"]);
    projectYML = replaceAll(projectYML,"[Prod Development Team]",mobileConfig["mobileConfiguration"]["prodDevTeam"]);
    projectYML = replaceAll(projectYML,"[Staging Development Team]",mobileConfig["mobileConfiguration"]["stagingDevTeam"]);
    projectYML = replaceAll(projectYML,"[Develop Development Team]",mobileConfig["mobileConfiguration"]["developDevTeam"]);
    projectYML = replaceAll(projectYML,"[Local Development Team]",mobileConfig["mobileConfiguration"]["localDevTeam"]);
    projectYML = replaceAll(projectYML,"[Entitlements File Name]",mobileConfig["mobileConfiguration"]["entitlementsFileName"]);


    fs.writeFileSync(projectYMLFile, projectYML, function (err) {
        if (err) return console.log(err);
        console.log('writing new project yml file to: ' + projectYMLFile);
    });

    function escapeRegExp(string) {
        return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
    }
    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }
    
})();
