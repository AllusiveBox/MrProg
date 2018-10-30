"use strict";
/*
    Command Name: avatar.js
    Function: Returns a User's Avatar
    Clearance: Mod+
    Default Enabled: Cannot be disabled
    Date Created: 04/14/18
    Last Updated: 10/20/18
    Last Update By: AllusiveBox

*/
Object.defineProperty(exports, "__esModule", { value: true });
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const hasElevatedPermissions_js_1 = require("../functions/hasElevatedPermissions.js");
const log_js_1 = require("../functions/log.js");
const config = require("../files/config.json");
const userids = require("../files/userids.json");
//command variables
const command = {
    adminOnly: false,
    bigDescription: ("Returns the target's avatar as a DM to the user, "
        + "works with both a mention and their ID. Use only to "
        + "validate if it's safe for the server or not. **Do not abuse.**\n"
        + "Returns:\n\n" + config.returnsDM),
    description: "DMs you with a user's avatar",
    enabled: null,
    fullName: "Avatar",
    name: "avatar",
    permissionLevel: "mod"
};
exports.help = command;
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
    // Find out Who to Get Avatar of
    let member = message.mentions.members.first();
    if (!member) { // If No Member is Mentioned, or API Returns null...
        log_js_1.debug(`No member mentioned trying by ID...`);
        let toCheck = args.slice(0).join(' ');
        if (message.guild.members.has(toCheck)) {
            log_js_1.debug(`Found a member by the given ID`);
            member = message.guild.members.get(toCheck);
        }
        else {
            let reply = (`I am sorry ${message.author}, either you did not mention a `
                + `valid member, used an incorrect ID, or the API returned a null user.\n`
                + `Please ask <@${userids.ownerID}> to investigate.`);
            await message.react(config.fail);
            return message.author.send(reply).catch(error => {
                return disabledDMs_js_1.run(message, reply);
            });
        }
    } // Valid Member was found
    log_js_1.debug(`Generating Avatar URL for ${member.user.username} and sending `
        + `it to ${message.author.username}.`);
    await message.author.send(bot.users.get(member.id).avatarURL)
        .then(function () {
        return message.react(config.success);
    })
        .catch(error => {
        message.react(config.fail);
        let reply = (`I am sorry, ${message.author}, I am unable to DM you.\n`
            + `Please check your privacy settings and try again.`);
        return disabledDMs_js_1.run(message, reply);
    });
}
exports.run = run;
