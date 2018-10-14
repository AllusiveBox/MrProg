"use strict";
/*
    Command Name: about.js
    Function: Give Bot Information
    Clearance: none
    Default Enabled: Yes
    Date Created: 10/15/17
    Last Updated: 10/13/18
    Last Update By: AllusiveBox

*/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const disabledDMs_1 = require("../functions/disabledDMs");
const config = require("../files/config.json");
// Command Variables
const command = {
    bigDescription: ("Returns information about me!\n"
        + "Returns:\n\t"
        + config.returnsDM),
    description: ("Returns informaton about the bot."),
    enabled: true,
    fullName: "About",
    name: "about",
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
    // Return About Text
    log_js_1.debug(`Generating About Message for ${message.author.username}`);
    let reply = (`Hello, my name is ${bot.user.username}! I was created by `
        + `${config.about.author}!\n\n`
        + `I am version: **${config.about.verNum}**.\n\n`
        + `I was last updated on: **${config.about.lastUpdated}**.\n\n`
        + `You can find my github repo here: <https://github.com/AllusiveBox/discordBot>`);
    // Send the Message
    return message.author.send(reply).catch(error => {
        return disabledDMs_1.run(message, reply);
    });
}
exports.run = run;
exports.help = command;
