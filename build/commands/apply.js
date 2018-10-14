"use strict";
/*
    Command Name: apply.js (previously join.js)
    Function: Returns instructions on how to Join the Team
    Clearance: none
    Default Enabled: Yes
    Date Created: 10/15/17
    Last Updated: 10/10/18
    Last Update By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const log_js_1 = require("../functions/log.js");
const config = require("../files/config.json");
// Command Stuff
const command = {
    bigDescription: ("This command will inform the user on how to join the MegaMan Battle Network Chrono X Development Team.\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Instructions on how to join the dev team.",
    enabled: true,
    fullName: "Apply",
    name: "apply",
    permissionLevel: "normal"
};
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 */
async function run(bot, message) {
    // Debug to Console
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    // Enabled Command Test
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.fullName, message);
    }
    // Build Reply
    let reply = ("Currently we are only looking for sprite and pixel artist.\n"
        + "If you are interested, or know someone who might be, please contact us with work samples at the following e-mail:\n"
        + "**cxdevteam@gmail.com**");
    return message.channel.send(reply);
}
exports.run = run;
exports.help = command;
