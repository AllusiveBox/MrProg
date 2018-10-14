"use strict";
/*
    Command Name: help.js
    Function: Sends a list of Commands to the User
    Clearance: none
    Default Enabled: Cannot be Disabled
    Date Created: 10/15/17
    Last Updated: 10/10/18
    Last Updated By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const hasElevatedPermissions_js_1 = require("../functions/hasElevatedPermissions.js");
const log_js_1 = require("../functions/log.js");
const config = require("../files/config.json");
const userIDs = require("../files/userids.json");
// Command Variables
const command = {
    bigDescription: ("You're a special kind of stupid, aren't you?"),
    description: `This command. Use ${config.prefix}help {commandName} to get additional information on specific commands!`,
    enabled: null,
    fullName: "Help",
    name: "help",
    permissionLevel: "normal"
};
/**
 *
 * @param {commandBot} bot
 * @param {Discord.Message} message
 * @param {string[]} args
 * @param {betterSql} sql
 */
async function run(bot, message, args, sql) {
    // Debug to Console
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    // Check if User is a Mod
    let isMod = await hasElevatedPermissions_js_1.run(bot, message, false, sql, true);
    // Check if User is Admin
    let isAdmin = await hasElevatedPermissions_js_1.run(bot, message, true, sql, true);
    // Check if User is Owner
    let isOwner = message.author.id === userIDs.ownerID ? true : false;
    if (args[0]) {
        let command = bot.commands.get(args[0].toLowerCase());
        // Test if Command Exists
        if (command === undefined) {
            log_js_1.debug(`Unable to locate command, ${args[0]}.`);
            let reply = `I am unable to locate command: ${args[0]}.`;
            return message.author.send(reply).catch(error => {
                disabledDMs_js_1.run(message, reply);
            });
        }
        if ((command.help.permissionLevel === "mod") && !(isMod || isAdmin || isOwner))
            return log_js_1.debug(`Not including ${command.help.name}`);
        if ((command.help.permissionLevel === "admin") && !(isAdmin || isOwner))
            return log_js_1.debug(`Not including ${command.help.name}`);
        if ((command.help.permissionLevel === "owner") && !isOwner)
            return log_js_1.debug(`Not including ${command.help.name}`);
        log_js_1.debug(`Generating help message for ${message.author.username} for the ${args[0]} command.`);
        return message.author.send(command.help.bigDescription).catch(error => {
            disabledDMs_js_1.run(message, `I am sorry, ${message.author}, I am unable to DM you.\n`
                + `Please check your privacy settings and try again.`);
        });
    }
    let reply = "**__A list of My Commands__**\n\n";
    bot.commands.forEach(function (command) {
        // Don't Print Disabled Commands
        if (command.help.enabled == false)
            return;
        // Permission Checks
        if ((command.help.permissionLevel === "mod") && !(isMod || isAdmin || isOwner))
            return log_js_1.debug(`Not including ${command.help.name}`);
        if ((command.help.permissionLevel === "admin") && !(isAdmin || isOwner))
            return log_js_1.debug(`Not including ${command.help.name}`);
        if ((command.help.permissionLevel === "owner") && !isOwner)
            return log_js_1.debug(`Not including ${command.help.name}`);
        let nextCommand = (`**${command.help.name}:\n\t**`
            + `${command.help.description}\n`);
        if (reply.length + nextCommand.length < 2000) { // Reply is Under Character Limit...
            reply = (`${reply}${nextCommand}`);
        }
        else { // Reply is Near Character Limit...
            message.author.send(reply).catch(error => {
                return disabledDMs_js_1.run(message, `I am sorry, ${message.author}, I am unable to DM you.\n`
                    + `Please check your privacy settings and try again.`);
            });
            reply = nextCommand;
        }
    });
    message.author.send(reply).catch(error => {
        return disabledDMs_js_1.run(message, `I am sorry, ${message.author}, I am unable to DM you.\n`
            + `Please check your privacy settings and try again.`);
    });
}
exports.run = run;
exports.help = command;
