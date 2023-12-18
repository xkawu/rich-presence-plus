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
                    return "up to date";
                } else {
                    return "need to update";
                }
            } else {
                throw new Error("Unable to check for new updates");
            }
        });
};

module.exports = { checkForUpdate };
