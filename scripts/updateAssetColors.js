const fs = require('fs');
const path = require('path');

(async () => {
    var myArgs = process.argv.slice(2);
    const projectName = myArgs[0];

    const mobileConfigFile = path.join(__dirname, '../..', projectName, "mconfig.json");
    const mobileConfig = JSON.parse(fs.readFileSync(mobileConfigFile, 'utf-8'));

    const defaultPrimaryColor = "#58DBB9"
    const newPrimaryColor = mobileConfig?.mobileConfiguration?.primaryColor ?? defaultPrimaryColor;
    const defaultSuccessColor = "#00B451"
    const newSuccessColor = mobileConfig?.mobileConfiguration?.successColor ?? defaultSuccessColor;
    const defaultErrorColor = "#BA1A1A"
    const newErrorColor = mobileConfig?.mobileConfiguration?.errorColor ?? defaultErrorColor;
    const defaultWarningColor = "#FABD00"
    const newWarningColor = mobileConfig?.mobileConfiguration?.warningColor ?? defaultWarningColor;
    
    const primaryColorAssets = [
                                "agentdualtone.imageset",
                                "camera.imageset",
                                "check_circle_black_border.imageset",
                                "cloud_home.imageset",
                                "local_network.imageset",
                                "location.imageset",
                                "path.imageset",
                                "personrunning.imageset",
                                "phonecall.imageset",
                                "routergreen.imageset",
                                "video_camera_color.imageset",
                                "video_camera.imageset",
                                ]
    
    const successColorAssets = [
                                "check_circle_green.imageset",
                                "check_green.imageset",
                                "smiley_wink.imageset"
                                ]
    
    const errorColorAssets = [
                              "alert.imageset",
                              "error-trailing-icon.imageset",
                              "no_internet.imageset",
                              "smiley_sad.imageset",
                              "warning_circle.imageset"
                              ]
    
    const warningColorAssets = [
                                "smiley_meh.imageset"
                                ]
    
    const assetsPath = path.join(__dirname, "../..", projectName, projectName, "Assets.xcassets");
    const assets = fs.readdirSync(assetsPath);
    
    for (asset of assets) {
        if (primaryColorAssets.includes(asset)) {
            update(projectName, asset, defaultPrimaryColor, newPrimaryColor)
        } else if (successColorAssets.includes(asset)) {
            update(projectName, asset, defaultSuccessColor, newSuccessColor)
        } else if (errorColorAssets.includes(asset)) {
            update(projectName, asset, defaultErrorColor, newErrorColor)
        } else if (warningColorAssets.includes(asset)) {
            update(projectName, asset, defaultWarningColor, newWarningColor)
        }
    }
})();


function update(projectName, asset, oldColor, newColor) {
    const assetPath = path.join(__dirname, "../..", projectName, projectName, "Assets.xcassets", asset);
    const svgs = fs.readdirSync(assetPath);
    
    for (svg of svgs) {
        if (!svg.includes(".svg")) { continue };
        
        const svgFilePath = path.join(__dirname,"../..", projectName, projectName, "Assets.xcassets", asset, svg);
        const svgFile = fs.readFileSync(svgFilePath, 'utf-8');

        var result = svgFile.replaceAll(oldColor, newColor);
        fs.writeFileSync(svgFilePath, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    }
}
