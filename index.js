const { ConsoleKit } = require("@kawu/console-kit");
const RPC = require("discord-rpc");
const chalk = require("chalk");
const fs = require("fs");

// Data stuff
const intervalPresetsInMs = 15000; // DO NOT GO BELOW 15s OR U WILL BE RATE LIMITED VERY FAST

// Utils
const ascii = require("./utils/asciis.js");
const updater = require("./utils/updater.js");
const config = require("./utils/config.js");
const presetsManager = require("./utils/presetsManager.js");
const activityHandler = require("./utils/activityHandler.js");

const consoleKit = new ConsoleKit();

process.title = "Rich Presence +";
console.clear();
console.log(ascii.title());
consoleKit.comment(ascii.credits());
console.log(" ");

const home = async () => {
    consoleKit.startLoading("Checking presets...");

    const dirs = await presetsManager.getPresets();
    consoleKit.stopLoading(true);
    consoleKit.check(`[${chalk.green(dirs.length)}] preset(s) found.`);

    consoleKit.startLoading("Checking config.json...");

    const configData = await config.getConfig();
    consoleKit.stopLoading(true);

    if (configData.hasBeenCreated) {
        consoleKit.info(
            "You need to configure config.json! See: https://github.com/xkawu/rich-presence-plus for help."
        );
        const appId = await consoleKit.prompt("Application ID");
        let staticPreset = null;

        const askMode = async () => {
            const mode = await consoleKit.prompt(
                "Rich Presence Mode [static/dynamic]"
            );

            if (mode === "static") {
                staticPreset = await consoleKit.prompt(
                    "Path to the static preset (optional)"
                );
                return mode;
            } else if (mode === "dynamic") {
                return mode;
            } else {
                return askMode();
            }
        };
        const mode = await askMode();

        if (staticPreset !== null) {
            if (!staticPreset.trim()) staticPreset = null;
        }

        consoleKit.startLoading("Editing config.json...");
        await config.editConfig({ appId, mode, staticPreset });
        consoleKit.stopLoading(true);

        consoleKit.check("config.json has been edited.");
    } else {
        consoleKit.check("config.json has been found.");
    }

    activityHandler.start(dirs, consoleKit);
};

const checkVersion = async () => {
    consoleKit.startLoading("Checking for updates...");

    const updateData = await updater.checkForUpdate();

    if (updateData.isUpToDate) {
        consoleKit.stopLoading(true);
        consoleKit.check(
            "Great! You have the last version of Rich Presence +."
        );

        setTimeout(() => {
            home();
        }, 1000);
    } else {
        consoleKit.stopLoading(true);
        consoleKit.x(
            `It's time to update! ${chalk.bold(
                config.getVersion()
            )} -> ${chalk.bold(updateData.version)}`
        );
        consoleKit.info(
            "Visit https://github.com/xkawu/rich-presence-plus to get the update."
        );

        process.exit();
    }
};
checkVersion();

return;
/*
process.title = "Rich Presence +";

startup();
async function startup() {
    console.clear();
    console.log(ascii.title());

    consoleKit.comment(
        `Rich Presence +  :::  created by kxwu  :::  ${version}`
    );
    consoleKit.info(`Welcome to ${chalk.bold("Rich Presence +")}`);
    console.log(" ");
    consoleKit.comment("What do you want to do ?");
    console.log(`${chalk.green("[1]")} - Start Rich Presence +`);
    console.log(`${chalk.green("[2]")} - Exit `);
    const answer = await consoleKit.prompt("Number");

    switch (answer) {
        case "1":
            process.title = "[ STARTING UP ] - Rich Presence +";
            console.clear();
            console.log(ascii.title());

            consoleKit.comment(
                `Rich Presence +  :::  created by kxwu  :::  ${version}`
            );
            console.log(" ");
            consoleKit.startLoading("Starting Rich Presence +...");

            startRPC();
            break;
        case "2":
            consoleKit.startLoading("Closing... Bye bye !");

            setTimeout(() => {
                process.exit();
            }, 1000);
            break;
        default:
            console.clear();
            startup();
            break;
    }
}

function getPresets() {}

async function getAppId() {
    try {
        let file = fs.readFileSync("./config.json");
        file = JSON.parse(file.toString());

        if (!file.appId) {
            throw new Error("No app ID");
        } else {
            return file.appId;
        }
    } catch (e) {
        if (e.message === "No app ID") {
            consoleKit.stopLoading();

            const appId = await consoleKit.prompt("Application ID");

            let file = fs.readFileSync("./config.json");
            file = JSON.parse(file.toString());

            try {
                fs.writeFileSync("./config.json", JSON.stringify(file));
            } catch (e) {
                consoleKit.x(
                    'An error has occured when trying to create "config.json" file.'
                );

                process.exit();
            }

            consoleKit.startLoading("Starting Rich Presence +...");

            return appId;
        } else {
            consoleKit.stopLoading();

            const configData = {
                appId: "",
                mode: "static",
            };

            const appId = await consoleKit.prompt("Application ID");

            configData.appId = appId;
            try {
                fs.appendFileSync("./config.json", JSON.stringify(configData));
            } catch (e) {
                consoleKit.x(
                    'An error has occured when trying to create "config.json" file.'
                );

                process.exit();
            }

            consoleKit.startLoading("Starting Rich Presence +...");

            return appId;
        }
    }
}

async function startRPC() {
    const appId = await getAppId();
    const presets = getPresets();

    consoleKit.startLoading(
        "Connecting to Application... (if this takes time, it means that you're being rate limited)"
    );

    RPC.register(appId);

    const client = new RPC.Client({ transport: "ipc" });

    client.on("ready", () => {
        consoleKit.stopLoading(true);
        consoleKit.check("Application connected.");

        consoleKit.startLoading("Loading Rich Presence presets config...");

        loadPresets();
        async function loadPresets() {
            try {
                let config = fs.readFileSync("./config.json");
                config = JSON.parse(config.toString());

                if (config.mode === "static") {
                    if (config.staticPreset) {
                        setActivity([config.staticPreset]);
                    } else {
                        setActivity([presets[0]]);
                    }
                } else if (config.mode === "dynamic") {
                    setActivity(presets.length === 1 ? [presets] : presets);
                } else {
                    config.mode = "static";
                    fs.writeFileSync("./config.json", JSON.stringify(config));
                    loadPresets();
                }
            } catch (e) {
                fs.appendFileSync(
                    "./config.json",
                    JSON.stringify({ appId: appId })
                );
            }
        }

        async function setActivity(presets) {
            let config = fs.readFileSync("./config.json");
            config = JSON.parse(config.toString());

            consoleKit.stopLoading(true);

            if (presets.length === 1) {
                try {
                    let preset = fs.readFileSync(presets[0]);
                    preset = JSON.parse(preset.toString());

                    client.setActivity(preset).catch((e) => {
                        consoleKit.x(e);

                        process.exit();
                    });

                    process.title = "[ CONNECTED ] - Rich Presence +";
                    console.clear();
                    console.log(ascii.title());

                    consoleKit.comment(
                        `Rich Presence +  :::  created by kxwu  :::  ${version}`
                    );
                    console.log(" ");
                    consoleKit.startLoading(
                        `Rich Presence + is running on ${client.user.username} account.`
                    );
                } catch (e) {
                    consoleKit.x(
                        "An error occured when setting up activity. Remember to not remove any files when Rich Presence + is running."
                    );

                    process.exit();
                }
            } else if (presets.length > 1) {
                process.title = "[ CONNECTED ] - Rich Presence +";
                console.clear();
                console.log(ascii.title());

                consoleKit.comment(
                    `Rich Presence +  :::  created by kxwu  :::  ${version}`
                );
                console.log(" ");
                consoleKit.startLoading(
                    `Rich Presence + is running on ${client.user.username} account.`
                );

                let i = 0;
                refreshActivity();
                setInterval(() => {
                    refreshActivity();
                }, intervalPresetsInMs);

                function refreshActivity() {
                    try {
                        if (i >= presets.length) i = 0;

                        let preset = fs.readFileSync(presets[i]);
                        preset = JSON.parse(preset.toString());

                        client.setActivity(preset).catch((e) => {
                            consoleKit.x(e);

                            process.exit();
                        });

                        i++;
                    } catch (e) {
                        consoleKit.x(
                            "Preset not found. Do not remove presets when dynamic mode is enable, kill the program and then you can edit presets."
                        );

                        process.exit();
                    }
                }
            }
        }
    });

    client.login({ clientId: appId }).catch(async (e) => {
        consoleKit.stopLoading(true);

        if (e.message === "connection closed") {
            consoleKit.x("Application ID is not valid.");

            try {
                let file = fs.readFileSync("./config.json");
                file = JSON.parse(file.toString());

                const answer = await consoleKit.prompt("Application ID");

                file.appId = answer;
                fs.writeFileSync("./config.json", JSON.stringify(file));

                consoleKit.startLoading("Loading...");
                startRPC();
            } catch (e) {
                fs.appendFileSync(
                    "./config.json",
                    JSON.stringify({ appId: appId, mode: "static" })
                );

                consoleKit.startLoading("Loading...");
                startRPC();
            }
        } else {
            consoleKit.x("You are being rate limited.");

            process.exit();
        }
    });
}
*/
