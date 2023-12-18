const fs = require("fs");

const getVersion = () => {
    try {
        const package = fs.readFileSync("./package.json");
        let version = JSON.parse(package.toString()).version;

        return version;
    } catch (e) {
        throw new Error('Unable to get version, "./package.json" is missing');
    }
};

module.exports = { getVersion };
