"use strict";
/*
    Command Name: n1.js
    Function: Provides a link to the N1GP server
    Clearance: none
    Default Enabled: Yes
    Date Created: 05/19/18
    Last Updated: 10/10/18
    Last Updated By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const disabledCommand_1 = require("../functions/disabledCommand");
const config = require("../files/config.json");
// Command Stuff
const inviteLink = config.n1gpLink;
const command = {
    bigDescription: ("Provides a link to the N1GP server.\n"
        + "Returns:\n\t" + config.returnsDM),
    description: "Sends a link to N1GP",
    enabled: true,
    fullName: "N1GP",
    name: "n1",
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
        return disabledCommand_1.run(command.name, message);
    }
    return message.author.send(inviteLink).catch(error => {
        disabledDMs_js_1.run(message, inviteLink);
    });
}
exports.run = run;
exports.help = command;
