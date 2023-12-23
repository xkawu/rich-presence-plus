const RPC = require("discord-rpc");
const config = require("./config.js");
const chalk = require("chalk");
const fs = require("fs");
const ascii = require("./asciis.js");
const presetsManager = require("./presetsManager.js");
const { ConsoleKit } = require("@kawu/console-kit");
const consoleKit = new ConsoleKit();
const intervalPresetsInMs = 15000;

const startFolderMode = async () => {
    const configData = config.getConfig();
    const appId = (await configData).appId;
    let statusInterval;

    consoleKit.startLoading("Checking presets...");
    const presets = await presetsManager.getPresets();
    consoleKit.stopLoading(true);
    consoleKit.check(
        `[${chalk.green(presets.length)}] preset(s) found inside "./presets"`
    );

    consoleKit.startLoading("Connecting to Discord");
    RPC.register(appId);
    const client = new RPC.Client({ transport: "ipc" });

    client.on("ready", async () => {
        process.title = "[ CONNECTED ] - Rich Presence +";
        consoleKit.stopLoading(true);
        consoleKit.check("Application ready");

        consoleKit.startLoading(
            `Rich Presence + is running on ${
                client.user.username
            } account.  :::  [${chalk.green(presets.length)}] preset(s) loaded.`
        );

        let presetsIndex = 0;
        const refreshActivity = () => {
            try {
                if (presetsIndex >= presets.length) presetsIndex = 0;

                let preset = fs.readFileSync(presets[presetsIndex]);
                preset = JSON.parse(preset.toString());

                client
                    .setActivity(preset)
                    .catch(async () => {})
                    .then(() => {
                        presetsIndex++;
                    });
            } catch (e) {
                (async () => {
                    try {
                        clearInterval(statusInterval);
                        consoleKit.stopLoading(true);
                    } catch (e) {}

                    consoleKit.x("Unable to get loaded preset (deleted?)");
                    const answer = await consoleKit.yesno(
                        "Changes has been detected to presets, do you want to restart?",
                        true
                    );

                    if (answer) {
                        console.clear();
                        console.log(ascii.title());
                        consoleKit.comment(ascii.credits());
                        console.log(" ");

                        startFolderMode(presets);
                    } else {
                        process.exit();
                    }
                })();
            }
        };
        refreshActivity();
        statusInterval = setInterval(() => {
            refreshActivity();
        }, intervalPresetsInMs);
    });

    client.login({ clientId: appId }).catch((e) => {
        try {
            consoleKit.stopLoading(true);
        } catch (e) {}

        if (e.message === "connection closed") {
            consoleKit.x("Application ID field in config.json is not valid.");
        } else if (e.message === "RPC_CONNECTION_TIMEOUT") {
            consoleKit.x("You have been timed out. Retry minimum after 15s.");
            process.exit();
        }
    });
};

const startDevMode = async () => {
    const configData = config.getConfig();
    const appId = (await configData).appId;
    const presets = [];

    try {
        consoleKit.startLoading("Checking presets...");
        const presetsFile = require(`../presets.js`);

        for (f in presetsFile) {
            presets.push(f);
        }

        consoleKit.stopLoading(true);
        consoleKit.check(
            `[${chalk.green(
                presets.length
            )}] preset(s) found inside "./presets.js"`
        );

        consoleKit.startLoading("Connecting to Discord");
        RPC.register(appId);
        const client = new RPC.Client({ transport: "ipc" });

        client.on("ready", async () => {
            process.title = "[ CONNECTED ] - Rich Presence +";
            consoleKit.stopLoading(true);
            consoleKit.check("Application ready");

            consoleKit.startLoading(
                `Rich Presence + is running on ${
                    client.user.username
                } account.  :::  [${chalk.green(
                    presets.length
                )}] preset(s) loaded.`
            );

            let presetsIndex = 0;
            const refreshActivity = async () => {
                if (presetsIndex >= presets.length) presetsIndex = 0;
                let preset = await presetsFile[presets[presetsIndex]]();

                client
                    .setActivity(preset)
                    .catch(async () => {})
                    .then(() => {
                        presetsIndex++;
                    });
            };

            refreshActivity();
            setInterval(async () => {
                refreshActivity();
            }, intervalPresetsInMs);
        });

        client.login({ clientId: appId }).catch((e) => {
            try {
                consoleKit.stopLoading(true);
            } catch (e) {}

            if (e.message === "connection closed") {
                consoleKit.x(
                    "Application ID field in config.json is not valid."
                );
            } else if (e.message === "RPC_CONNECTION_TIMEOUT") {
                consoleKit.x(
                    "You have been timed out. Retry minimum after 15s."
                );
                process.exit();
            }
        });
    } catch (e) {
        console.log(e);
        throw new Error(
            "presets.js at root of project doesn't exist, please follow https://github.com/xkawu/rich-presence-plus"
        );
    }
};

module.exports = { startFolderMode, startDevMode };
