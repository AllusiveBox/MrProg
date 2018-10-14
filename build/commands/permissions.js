"use strict";
/*
    Command Name: permissions.js
    Function: Returns a user's clearance level
    Clearance: none
    Default Enabled: Yes
    Date Created: 10/18/17
    Last Updated: 10/10/18
    Last Updated By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const log_js_1 = require("../functions/log.js");
const config = require("../files/config.json");
// Command Required Files
const command = {
    bigDescription: ("Returns what permissions the mentioned user has, or for the user if nobody was mentioned\n"
        + "Returns:\n\t" + config.returnsDM),
    description: "Returns a user's permissions",
    enabled: true,
    fullName: "Permissions",
    name: "permissions",
    permissionLevel: "normal"
};
/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {?string[]} [args]
 * @param {!betterSql} sql
 */
async function run(client, message, args, sql) {
    // Debug to Console Log
    log_js_1.debug(`I am inside the ${command.fullName} Command.`);
    // Enabled Command Test
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.fullName, message);
    }
    // Find out who to Check
    let toCheck;
    let user;
    try {
        toCheck = message.mentions.members.first();
        user = toCheck.user.username;
    }
    catch (error) {
        toCheck = message.author;
        user = toCheck.username;
    }
    log_js_1.debug(`Checking user permissions for ${user}`);
    let row = await sql.getUserRow(toCheck.id);
    if (!row) {
        log_js_1.debug(`${user} does not exist in database`);
        return message.channel.send(`I am unable to locate data on ${user}.`);
    }
    let clearanceLevel = row.clearance;
    if (!clearanceLevel) {
        clearanceLevel = "none";
    }
    let reply = `The Permissions level for ${toCheck} is: **${clearanceLevel}**`;
    return message.author.send(reply).catch(error => {
        return disabledDMs_js_1.run(message, reply);
    });
}
exports.run = run;
exports.help = command;
