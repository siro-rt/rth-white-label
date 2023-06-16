const fs = require('fs');
const path = require('path');

(async () => {

    var myArgs = process.argv.slice(2);
    const projectName = myArgs[0];
    const entitlementsFileName = projectName + '.entitlements'
    const entitlementsFile = path.join(__dirname, '../..', projectName, projectName, entitlementsFileName);
    const mobileConfigFile = path.join(__dirname, '../..', projectName, "mconfig.json");
    const mobileConfig = JSON.parse(fs.readFileSync(mobileConfigFile, 'utf-8'));
    // Entitlements file 
    var entitlementParsed = fs.readFileSync(entitlementsFile, 'utf-8');
    appLinksName = mobileConfig["mobileConfiguration"]["appLinksName"];
    entitlementParsed = replaceAll(entitlementParsed, "[App Links Name]", appLinksName);

    fs.writeFileSync(entitlementsFile, entitlementParsed, function writeJSON(err) {
        if (err) return console.log(err);
        console.log('writing new entitlements file to: ' + entitlementsFile);
      });
    

    function escapeRegExp(string) {
        return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
    }
    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }
    
})();
