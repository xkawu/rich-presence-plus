const RPC = require("discord-rpc");
const config = require("./config.js");
const chalk = require("chalk");
const fs = require("fs");

const ascii = require("./asciis.js");
const { ConsoleKit } = require("@kawu/console-kit");
const intervalPresetsInMs = 15000;

const consoleKit = new ConsoleKit();

const start = async (presets) => {
    const configData = config.getConfig();
    const appId = (await configData).config.appId;

    consoleKit.startLoading("Connecting to Discord");

    RPC.register(appId);

    const client = new RPC.Client({ transport: "ipc" });

    client.on("ready", async () => {
        consoleKit.stopLoading(true);

        consoleKit.check("Application Connected");

        if ((await config.getConfig()).config.mode === "static") {
            try {
                const presetPath = (await config.getConfig()).config
                    .staticPreset
                    ? (await config.getConfig()).config.staticPreset
                    : presets[0];
                let preset = fs.readFileSync(presetPath);
                preset = JSON.parse(preset.toString());

                client.setActivity(preset).catch(async (e) => {
                    try {
                        consoleKit.stopLoading(true);
                    } catch (e) {}

                    const answer = await consoleKit.yesno(
                        `"${presetPath}" contains not valid values and Rich Presence + needs to restart, do you want to restart?`,
                        true
                    );

                    if (answer) {
                        start(presets);
                    } else {
                        process.exit();
                    }
                });

                process.title = "[ CONNECTED ] - Rich Presence +";
                console.clear();
                console.log(ascii.title());
                consoleKit.comment(ascii.credits());
                console.log(" ");

                consoleKit.info(
                    `Rich Presence + is running on ${
                        client.user.username
                    } account.  :::  Mode: ${chalk.green("static")}`
                );
            } catch (e) {
                consoleKit.x("Errors has been detected!");
                const answer = await consoleKit.yesno(
                    "Errors has been detected, check your presets folder or config.json, do you want to restart?",
                    true
                );

                if (answer) {
                    start(presets);
                } else {
                    process.exit();
                }
            }
        } else if ((await config.getConfig()).config.mode === "dynamic") {
            process.title = "[ CONNECTED ] - Rich Presence +";
            console.clear();
            console.log(ascii.title());
            consoleKit.comment(ascii.credits());
            console.log(" ");

            consoleKit.info(
                `Rich Presence + is running on ${
                    client.user.username
                } account.  :::  Mode: ${chalk.green(
                    "dynamic"
                )}  :::  [${chalk.green(presets.length)}] preset(s) detected.`
            );

            let i = 0;
            const refreshActivity = () => {
                try {
                    if (i >= presets.length) i = 0;

                    let preset = fs.readFileSync(presets[i]);
                    preset = JSON.parse(preset.toString());

                    client
                        .setActivity(preset)
                        .catch(async (e) => {
                            try {
                                consoleKit.stopLoading(true);
                            } catch (e) {}

                            consoleKit.x("Invalid values in preset!");
                            const answer = await consoleKit.yesno(
                                `"${presets[i]}" contains not valid values and Rich Presence + needs to restart, do you want to restart?`,
                                true
                            );

                            if (answer) {
                                start(presets);
                            } else {
                                process.exit();
                            }
                        })
                        .then(() => {
                            i++;
                        });
                } catch (e) {
                    (async () => {
                        consoleKit.x(
                            "Unable to get loaded preset (has been deleted?)"
                        );
                        const answer = await consoleKit.yesno(
                            "Changes has been detected to presets, do you want to restart?",
                            true
                        );

                        if (answer) {
                            start(presets);
                        } else {
                            process.exit();
                        }
                    })();
                }
            };
            refreshActivity();
            setInterval(() => {
                refreshActivity();
            }, intervalPresetsInMs);
        }
    });

    client.login({ clientId: appId }).catch((e) => {
        try {
            consoleKit.stopLoading(true);
        } catch (e) {}

        if (e.message === "connection closed") {
            consoleKit.x("Application ID field in config.json is not valid.");
        } else if (e.message === "RPC_CONNECTION_TIMEOUT") {
            consoleKit.x("You have been timed out.");
            process.exit();
        }
    });
};

module.exports = { start };
