"use strict";
/*
    Command Name: download.js (previously play.js)
    Function: Returns a link to download the demo
    Clearance: none
    Default Enabled: Yes
    Date Created: 10/17/17
    Last Updated: 10/10/18
    Last Updated By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const config = require("../files/config.json");
// Command Variables
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
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @returns {Promise<void>}
 */
async function run(bot, message) {
    // Debug to Console
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    // Enabled Command Test
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.fullName, message);
    }
    // Build Reply
    let reply = (`To download the latest version of Chrono X, check the following link: \n`
        + `http://www.mmbnchronox.com/game.php`);
    message.channel.send(reply);
}
exports.run = run;
exports.help = command;
