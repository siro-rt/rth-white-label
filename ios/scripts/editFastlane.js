const fs = require('fs');
const path = require('path');
const plist = require('plist');

(async () => {

    var myArgs = process.argv.slice(2);
    const branchName = myArgs[0];

    const projectNamesFile = path.join(__dirname, 'project-names.json');
    const projectNames = JSON.parse(fs.readFileSync(projectNamesFile, 'utf-8'));
    const projectName = projectNames[branchName.toLowerCase()];
    console.log(projectName);
    console.log(__dirname);
    const mobileConfigFile = path.join(__dirname, '../..', projectName, "mconfig.json");
    console.log(mobileConfigFile);
    var mobileConfig = JSON.parse(fs.readFileSync(mobileConfigFile, 'utf-8'));

    const appfileFile = path.join(__dirname, '../..', 'fastlane', 'Appfile');
    const fastfileFile = path.join(__dirname, '../..', 'fastlane', 'Fastfile');

    const itcJSONFile = path.join(__dirname, 'itc-connect.json');
    const itcJSON = JSON.parse(fs.readFileSync(itcJSONFile, 'utf-8'));
    const itcTeamID = itcJSON[branchName.toLowerCase()];

    const appleIDsFile = path.join(__dirname, 'apple-ids.json');
    const appleIDs = JSON.parse(fs.readFileSync(appleIDsFile, 'utf-8'));
    const appleID = appleIDs[branchName.toLowerCase()];

    const bundle = mobileConfig["mobileConfiguration"]["prodBundle"];
    const prodDevTeam = mobileConfig["mobileConfiguration"]["prodDevTeam"];

    // add to mobile config for future use
    mobileConfig["mobileConfiguration"]["itcTeamID"] = itcTeamID;
    mobileConfig["mobileConfiguration"]["appleID"] = appleID;

    fs.writeFileSync(mobileConfigFile, JSON.stringify(mobileConfig,null,4), function (err) {
        if (err) return console.log(err);
        console.log('writing mobile config file to: ' + mobileConfigFile);
    });

    // edit Appfile
    appfile = fs.readFileSync(appfileFile, 'utf-8');
    appfile = replaceAll(appfile, "[bundle]", bundle);
    appfile = replaceAll(appfile, "[itc id]", itcTeamID);
    appfile = replaceAll(appfile, "[Prod Development Team]", prodDevTeam);

    fs.writeFileSync(appfileFile, appfile, function (err) {
        if (err) return console.log(err);
        console.log('writing Appfile file to: ' + appfileFile);
    });

    // edit Fastfile
    fastfile = fs.readFileSync(fastfileFile, 'utf-8');
    fastfile = replaceAll(fastfile, "[Scheme Name]", projectName);
    fastfile = replaceAll(fastfile, "[Apple ID]", appleID);
    fastfile = replaceAll(fastfile, "[Prod Target Name]", bundle);

    if (mobileConfig?.mobileConfiguration?.git_branch) {
        fastfile = replaceAll(fastfile, "[Branch Name]", mobileConfig["mobileConfiguration"]["git_branch"]);
    } else {
        fastfile = replaceAll(fastfile, "[Branch Name]", branchName);
    }

    fs.writeFileSync(fastfileFile, fastfile, function (err) {
        if (err) return console.log(err);
        console.log('writing new Fastfile file to: ' + fastfileFile);
    });


    function escapeRegExp(string) {
        return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
    }
    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }
    
})();
