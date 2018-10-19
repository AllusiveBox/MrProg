"use strict";
/*
    Command Name:
    Function:
    Clearance: none
    Default Enabled: Yes
    Date Created: 10/13/18
    Last Updated: 10/19/18
    Last Updated By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const config = require("../files/config.json");
const userids = require("../files/userids.json");
// Command Variables
const command = {
    bigDescription: ("This command informs you of what the mistake was."
        + "Returns\n\t"
        + config.returnsChannel),
    description: "Oh, mistakes were made...",
    enabled: true,
    fullName: "Mistake",
    name: "mistake",
    permissionLevel: "owner"
};
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 */
async function run(bot, message) {
    // Debug to Console
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if ((message.author.id === userids.maxID) || (message.author.id === userids.ownerID)) {
        return message.channel.send({ file: "./img/mistake.png" }).catch(error => {
            log_js_1.error(error);
            return message.channel.send(error.toString());
        });
    }
}
exports.run = run;
exports.help = command;
