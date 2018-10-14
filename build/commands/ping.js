"use strict";
/*
    Command Name: !ping
    Function: Returns ping so that users can tell if the bot is accepting commands currently.
    Clearance: none
    Default Enabled: Yes
    Date Created: 10/15/17
    Last Updated: 10/10/18
    Last Update By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const config = require("../files/config.json");
// Command Variables
const command = {
    bigDescription: ("Bot Replies \"Pong!\" Useful if you want to see if the bot is "
        + "active and accepting commands.\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Bot Replies \"Pong!\".",
    enabled: true,
    fullName: "Ping",
    name: "ping",
    permissionLevel: "normal"
};
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string[]} [args]
 */
async function run(bot, message, args) {
    // Debug to Console
    log_js_1.debug(`I am in the ${command.fullName} command.`);
    // Enabled Command Test
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.name, message);
    }
    return message.channel.send("pong!");
}
exports.run = run;
exports.help = command;
