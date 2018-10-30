"use strict";
/*
    Command Name: created.js
    Function: Returns the Date your Account was Created
    Clearance: none
    Default Enabled: Cannot be disabled.
    Date Created: 05/23/18
    Last Updated: 10/20/18
    Last Update By: AllusiveBox

*/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const config = require("../files/config.json");
// Command Variables
const command = {
    bigDescription: ("This command will return the date and time your account was created.\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Find out when your account was made.",
    enabled: null,
    fullName: "Created",
    name: "created",
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
    let createdOn = await new Date((Number(message.author.id) / 4194304) + 1420070040000);
    message.channel.send(`Account created on: **${createdOn}**`)
        .catch(error => {
        log_js_1.error(error);
        return message.channel.send(`*${error.toString()}*`);
    });
}
exports.run = run;
exports.help = command;
