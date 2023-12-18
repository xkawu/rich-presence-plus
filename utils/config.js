const fs = require("fs");

const getVersion = () => {
    try {
        const package = fs.readFileSync("./package.json");
        let version = JSON.parse(package.toString()).version;

        return version;
    } catch (e) {
        throw new Error(
            'Unable to get version, "./package.json" is may be missing'
        );
    }
};

const getConfig = async () => {
    try {
        let config = fs.readFileSync("./config.json");
        config = JSON.parse(config.toString());

        if (config.appId) {
            if (!config.appId.trim()) {
                return {
                    hasBeenCreated: true,
                    config,
                };
            }
        } else {
            return {
                hasBeenCreated: true,
                config,
            };
        }

        return {
            hasBeenCreated: false,
            config,
        };
    } catch (e) {
        const defaultConfig = { appId: "", mode: "static" };

        try {
            fs.appendFileSync("./config.json", JSON.stringify(defaultConfig));

            return {
                hasBeenCreated: true,
                config: defaultConfig,
            };
        } catch (e) {
            throw new Error('An error occurred when creating "./config.json"');
        }
    }
};

const editConfig = async ({ appId, mode, staticPreset }) => {
    try {
        let config = fs.readFileSync("./config.json");
        config = JSON.parse(config.toString());

        config.appId = appId;
        config.mode = mode;
        config.staticPreset = staticPreset;

        fs.writeFileSync("./config.json", JSON.stringify(config));

        return config;
    } catch (e) {
        throw new Error('An error occurred when writing in "./config.json"');
    }
};

module.exports = { getVersion, getConfig, editConfig };
