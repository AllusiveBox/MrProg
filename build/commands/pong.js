"use strict";
/*
    Command Name: pong.js
    Function: Test if Bot is Online
    Clearance: none
    Default Enabled: Yes
    Date Created: 04/23/18
    Last Updated: 10/10/18
    Last Updated By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const config = require("../files/config.json");
// Command Variables
const command = {
    bigDescription: ("Bot Replies \"gnip!\" Useful if you want to see if the bot is "
        + "active and accepting commands.\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Bot Replies \"gnip!\".",
    enabled: true,
    fullName: "Pong",
    name: "Pong",
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
        disabledCommand_js_1.run(command.name, message);
    }
    return message.channel.send("gnip!");
}
exports.run = run;
exports.help = command;
