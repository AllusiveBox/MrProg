"use strict";
/*
    Command Name: oof.js
    Function: Returns an oof
    Clearance: none
    Default Enabled: Yes
    Date Created: 01/15/18
    Last Updated: 10/10/18
    Last Updated By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const log_js_1 = require("../functions/log.js");
const config = require("../files/config.json");
// Command Stuff
const command = {
    bigDescription: ("Sends the Oof! picture\n"
        + "Returns:\n\t" + config.returnsChannel),
    description: "Returns an oof",
    enabled: true,
    fullName: "Oof!",
    name: "oof",
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
        return disabledCommand_js_1.run(command.name, message);
    }
    return message.channel.send({ file: "./img/oof.png" }).catch(error => {
        log_js_1.error(error);
        message.channel.send(`Unexpected error caused by ${message.author} when using the ${command.name} command.`);
    });
}
exports.run = run;
exports.help = command;
