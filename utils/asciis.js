const chalk = require("chalk");
const config = require("./config.js");

const title = () => {
    return chalk.red(
        "  ___ _    _      ___                               ___ _   _   _ ___ \r\n | _ (_)__| |_   | _ \\_ _ ___ ___ ___ _ _  __ ___  | _ \\ | | | | / __|\r\n |   / / _| ' \\  |  _/ '_/ -_|_-</ -_) ' \\/ _/ -_) |  _/ |_| |_| \\__ \\\r\n |_|_\\_\\__|_||_| |_| |_| \\___/__/\\___|_||_\\__\\___| |_| |____\\___/|___/\r\n                                                                      "
    );
};

const credits = () => {
    return `Rich Presence +  :::  created by kxwu  :::  v${config.getVersion()}`;
};

module.exports = { title, credits };
