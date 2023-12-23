const { ConsoleKit } = require("@kawu/console-kit");
const chalk = require("chalk");

// Utils
const ascii = require("./utils/asciis.js");
const updater = require("./utils/updater.js");
const config = require("./utils/config.js");
const activityHandler = require("./utils/activityHandler.js");

const consoleKit = new ConsoleKit();

process.title = "Rich Presence +";
console.clear();
console.log(ascii.title());
consoleKit.comment(ascii.credits());
console.log(" ");

const home = async () => {
    const configData = await config.getConfig();

    if (!configData.mode || !configData.mode.trim())
        throw new Error(
            "No mode present in config.json. Help at https://github.com/xkawu/rich-presence-plus"
        );

    switch (configData.mode) {
        case "folder":
            consoleKit.info(`Mode ${chalk.green("folder")} is being used.`);

            activityHandler.startFolderMode();
            break;
        case "dev":
            consoleKit.info(`Mode ${chalk.green("dev")} is being used.`);

            activityHandler.startDevMode();
            break;
        default:
            consoleKit.x(
                `${configData.mode} is not a mode. Help at https://github.com/xkawu/rich-presence-plus`
            );
            break;
    }
};

const checkVersion = async () => {
    consoleKit.startLoading("Checking for updates...");

    const updateData = await updater.checkForUpdate();

    if (updateData.isUpToDate) {
        consoleKit.stopLoading(true);
        consoleKit.check("Great! You have the last version of Rich Presence +");

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

        await consoleKit.prompt("Hit [Enter] to close", true);
        process.exit();
    }
};
checkVersion();
