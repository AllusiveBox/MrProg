"use strict";
/*
    Command Name: google.js
    Function: Just google it, Lan...
    Clearance: none
    Default Enabled: Yes
    Date Created: 01/15/18
    Last Updated: 10/10/18
    Last Update By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const config = require("../files/config.json");
// Command Variables
const command = {
    bigDescription: ("Just google it, Lan...\n"
        + "Returns:\n\t" + config.returnsChannel),
    description: "Google it",
    enabled: true,
    fullName: "Google",
    name: "google",
    permissionLevel: "normal"
};
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string[]} args
 */
async function run(bot, message, args) {
    // Debug to Console
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    // Enabled Command Test
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.name, message);
    }
    // DM Check
    if (await (!dmCheck_js_1.check(message, command.name))) {
        message.delete().catch(error => {
            log_js_1.error(`Unable to purge command by ${message.author.username}.`);
        });
    }
    return message.channel.send({ file: "./img/google.png" });
}
exports.run = run;
exports.help = command;
