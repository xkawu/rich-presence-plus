const config = require("./config.js");

const checkForUpdate = async () => {
    return fetch(
        "https://raw.githubusercontent.com/xkawu/rich-presence-plus/main/package.json"
    )
        .then((res) => res.json())
        .then((body) => {
            if (body && body.version) {
                const version = config.getVersion();

                if (version === body.version) {
                    return {
                        isUpToDate: true,
                        version: body.version,
                    };
                } else {
                    return {
                        isUpToDate: false,
                        version: body.version,
                    };
                }
            } else {
                throw new Error("Unable to check for new updates");
            }
        });
};

module.exports = { checkForUpdate };
