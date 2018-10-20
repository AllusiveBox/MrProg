"use strict";
/*
    Command Name: kick.js
    Function: Kick a user from the Server
    Clearance: Mod+
    Default Enabled: Cannot be Disabled
    Date Created: 08/31/18
    Last Updated: 10/13/18
    Last Update By: AllusiveBox

*/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const hasElevatedPermissions_js_1 = require("../functions/hasElevatedPermissions.js");
const kick_js_1 = require("../functions/kick.js");
const config = require("../files/config.json");
const roles = require("../files/roles.json");
const userids = require("../files/userids.json");
// Command Variables
const adminRole = roles.adminRole;
const modRole = roles.modRole;
const shadowModRole = roles.sModRole;
const command = {
    adminOnly: false,
    bigDescription: ("Use this command to kick someone from a server \n"
        + "Arguments:\n\t"
        + "@{user} -> The user to ban.\n\t"
        + "{string} -> The reason the member is to be kicked.\n"
        + "Returns:\n\t"
        + "On successful kick, a message will be logged."),
    description: "Kick a user form the server",
    enabled: null,
    fullName: "Kick",
    name: "kick",
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
    // Check if User has permission to use kick command
    if (!await hasElevatedPermissions_js_1.run(bot, message, command.adminOnly, sql))
        return;
    // Get Member to Kick
    var toKick = message.mentions.members.first();
    if (!toKick) { // No Member to Kick...
        log_js_1.debug(`A valid member of the server was not provided.`);
        let reply = (`Please mention a valid member on the server, `
            + `${message.author}.`);
        return message.author.send(reply).catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
    }
    // Validate the kick Target
    if (toKick.user.id == userids.ownerID) { // If Attempt to Kick Owner...
        return log_js_1.debug(`${message.author.username} attempted to kick owner.`);
    }
    else if (toKick.roles.some(r => [adminRole.ID, modRole.ID,
        shadowModRole.ID].includes(r.id))) { // If Attempt to kick Admin/Mod/SMod
        log_js_1.debug(`${message.author.username} attempted to kick `
            + `${toKick.user.username}.`);
        return message.channel.send(`I am sorry, ${message.author}, I am `
            + `unable to kick ${toKick.user.username} due to the role(s) `
            + `they have.`);
    }
    // Get Reason for Kicking Member
    var reason = args.slice(1).join(" ");
    if (!reason) { // No Reason Provided...
        log_js_1.debug(`No valid reason was provided.`);
        let reply = (`Please indicate a valid reason for kicking `
            + `${toKick.user.username}.`);
        return message.author.send(reply).catch(error => {
            log_js_1.debug(`${message.author.username} has DMs disabled.`);
            disabledDMs_js_1.run(message, reply);
        });
    }
    // Set the isKicking flag to true
    await log_js_1.debug("setting kick flag to true");
    config.isKicking = true;
    kick_js_1.run(bot, message, toKick, reason, sql);
}
exports.run = run;
exports.help = command;
