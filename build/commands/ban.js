"use strict";
/*
    Command Name: ban.js
    Function: Ban a user from the Server
    Clearance: Mod+
    Default Enabled: Cannot be Disabled
    Date Created: 12/02/17
    Last Updated: 10/13/18
    Last Update By: AllusiveBox

*/
Object.defineProperty(exports, "__esModule", { value: true });
const ban_js_1 = require("../functions/ban.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const hasElevatedPermissions_js_1 = require("../functions/hasElevatedPermissions.js");
const log_js_1 = require("../functions/log.js");
const config = require("../files/config.json");
const roles = require("../files/roles.json");
const userids = require("../files/userids.json");
// Command Variables
const command = {
    adminOnly: false,
    bigDescription: ("Use this command to ban someone from a server \n"
        + "Arguments:\n\t"
        + "@{user} -> The user to ban.\n\t"
        + "{string} -> The reason the member is to be banned.\n"
        + "Returns:\n\t"
        + "On successful ban, a message will be logged."),
    description: "Ban someone from a server",
    enabled: null,
    fullName: "Ban",
    name: "ban",
    permissionLevel: "mod"
};
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string[]} args
 * @param {betterSql} sql
 */
async function run(bot, message, args, sql) {
    // Debug to Console
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    // DM Check
    if (dmCheck_js_1.run(message, command.fullName))
        return; // Return on DM channel
    if (!await hasElevatedPermissions_js_1.run(bot, message, command.adminOnly, sql))
        return;
    // Get Member to Ban
    var toBan = message.mentions.members.first();
    if (!toBan) { // No Member to Ban...
        log_js_1.debug(`A valid member of the server was not provided.`);
        let reply = (`Please mention a valid member on the server, `
            + `${message.author}.`);
        return message.author.send(reply).catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
    }
    // Validate the Ban Target
    if (toBan.user.id == userids.ownerID) { // If Attempt to Ban Owner...
        return log_js_1.debug(`${message.author.username} attempted to ban owner.`);
    }
    else if (toBan.roles.some(r => [roles.adminRole.ID, roles.modRole.ID,
        roles.sModRole.ID].includes(r.id))) { // If Attempt to Ban Admin/Mod/SMod
        log_js_1.debug(`${message.author.username} attempted to ban `
            + `${toBan.user.username}.`);
        return message.channel.send(`I am sorry, ${message.author}, I am `
            + `unable to ban ${toBan.user.username} due to the role(s) `
            + `they have.`);
    }
    // Get Reason for Banning Member
    var reason = args.slice(1).join(" ");
    if (!reason) { // No Reason Provided...
        log_js_1.debug(`No valid reason was provided.`);
        let reply = (`Please indicate a valid reason for banning `
            + `${toBan.user.username}.`);
        return message.author.send(reply).catch(error => {
            log_js_1.debug(`${message.author.username} has DMs disabled.`);
            disabledDMs_js_1.run(message, reply);
        });
    }
    // Set the isKicking flag to true
    config.isKicking = true;
    ban_js_1.run(bot, message, toBan, reason);
}
exports.run = run;
exports.help = command;
