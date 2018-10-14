"use strict";
/*
    Command Name: joindate.js
    Function: Returns the Date the Member Joined the Server
    Clearance: none
    Default Enabled: Cannot be Disabled
    Date Created: 04/24/18
    Last Updated: 10/10/18
    Last Updated By: Th3_M4j0r
*/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const config = require("../files/config.json");
// Command Stuff
const command = {
    bigDescription: ("Returns when the user had joined the server.\n"
        + "Returns\n\t" + config.returnsDM),
    description: "Returns user's join date",
    enabled: null,
    fullName: "Join Date",
    name: "joindate",
    permissionLevel: "normal"
};
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 */
async function run(bot, message) {
    // Debug to Console
    log_js_1.debug(`I am in the ${command.fullName} command.`);
    // DM Check
    if (await dmCheck_js_1.run(message, command.fullName))
        return; // Return on DM channel
    // Build the Reply
    let reply = (`You joined the server on: **${message.member.joinedAt}**.`);
    return message.author.send(reply).catch(error => {
        disabledDMs_js_1.run(message, reply);
    });
}
exports.run = run;
exports.help = command;
