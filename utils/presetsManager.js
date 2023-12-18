const fs = require("fs");

const getPresets = async () => {
    try {
        const dir = fs.readdirSync("./presets");
        let dirs = dir.map((fileName) => (fileName = "./presets/" + fileName));
        dirs = dirs.filter((path) => path.endsWith(".json"));

        if (dirs.length === 0) {
            throw new Error("no presets in folder");
        } else {
            return dirs;
        }
    } catch (e) {
        if (e.message !== "No presets in folder") {
            try {
                fs.mkdirSync("./presets");
            } catch (e) {
                throw new Error('Unable to create "presets" folder');
            }
        }

        const defaultPreset = {
            details: "Rich Presence +",
            largeImageKey: "https://cdn3.emoji.gg/emojis/9588-silver-star.png",
            buttons: [
                {
                    label: "Rich Presence + Author",
                    url: "https://github.com/xkawu",
                },
            ],
        };

        try {
            fs.appendFileSync(
                "./presets/config.json",
                JSON.stringify(defaultPreset)
            );
        } catch (e) {
            throw new Error(
                'An error occurred when creating "./presets/config.json"'
            );
        }

        const dir = fs.readdirSync("./presets");
        let dirs = dir.map((fileName) => (fileName = "./presets/" + fileName));
        dirs = dirs.filter((path) => path.endsWith(".json"));

        return dirs;
    }
};

module.exports = { getPresets };
