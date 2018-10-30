"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const config = require("../files/config.json");
const command = {
    bigDescription: ("This command provides a link to download the latest demo of MegaMan Battle Network Chrono X.\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Gives you the download link!",
    enabled: true,
    fullName: "Download",
    name: "download",
    permissionLevel: "normal"
};
async function run(bot, message) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.fullName, message);
    }
    let reply = (`To download the latest version of Chrono X, check the following link: \n`
        + `http://www.mmbnchronox.com/game.php`);
    message.channel.send(reply);
}
exports.run = run;
exports.help = command;
