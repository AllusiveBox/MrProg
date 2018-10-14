"use strict";
/*
    Command Name: bork.js
    Function: The bot borks back
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
const userids = require("../files/userids.json");
var borkMaster = false;
// Command Variables
const command = {
    bigDescription: ("If you bork at the bot, I wonder what will happen?\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Sometimes you bork at the bot, and sometimes the bot borks back...",
    enabled: true,
    fullName: "Bork",
    name: "bork",
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
    // Ensure Borkmaster is reset
    borkMaster = false;
    // Check if Member is in User ID List
    Object.keys(userids).forEach(function (key) {
        if (userids[key] === message.author.id) { // If Member is in User ID List...
            // return message.channel.send(`Bork to you too, young master.`);
            return borkMaster = true;
        }
    });
    if (borkMaster) {
        message.channel.send(`Bork to you too, young master.`);
    }
    else {
        message.channel.send(`What did you just say to me, ${message.author}`
            + `? I'll have you know that I graduated at the top of my class in the `
            + `${bot.user.username} accademy. You better watch yourself, kiddo.`);
    }
}
exports.run = run;
exports.help = command;
