"use strict";
/*
    Command Name: deleteme.js
    Function: Deletes a User's Data from the SQL database
    Clearance: none
    Default Enabled: Cannot be Disabled
    Date Created: 05/22/18
    Last Updated: 10/10/18
    Last Update By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const dmCheck_js_1 = require("../functions/dmCheck.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const deleteMemberInfo_js_1 = require("../functions/deleteMemberInfo.js");
const log_js_1 = require("../functions/log.js");
const config = require("../files/config.json");
const userids = require("../files/userids.json");
// Command Variables
const commandUsed = new Set();
const command = {
    bigDescription: ("Deletes the user's data from the user database."
        + "Returns\n\t"
        + config.returnsDM),
    description: "Deletes user's data from the user database.",
    enabled: null,
    fullName: "Delete Me",
    name: "deleteme",
    permissionLevel: "normal"
};
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string[]} [args]
 * @param {betterSql} sql
 */
async function run(bot, message, args, sql) {
    // Debug to Console
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    // DM Check
    if (await dmCheck_js_1.run(message, command.fullName))
        return; // Return on DM channel
    //SQL Stuff
    let row = await sql.getUserRow(message.author.id);
    if (!row) { //if row not found
        let reply = (`I am unable to locate any data on you.\n`
            + `Please either try again, or alert <@${userids.ownerID}>.`);
        return message.author.send(reply)
            .catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
    }
    if (!commandUsed.has(message.author.id)) { // If User Hasn't Used Command
        let reply = (`**__WARNING!!!__**\n\n`
            + `Using the ${config.prefix}deleteMe command deletes ***all*** of `
            + `your non-public data stored in the user information database.\n\n`
            + `**__This action cannot be undone.__**\n\n`
            + `If you are sure you want to delete this data, use this command `
            + `again.`);
        message.author.send(reply).catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
        commandUsed.add(message.author.id);
        setTimeout(() => {
            // Remove User from the set after 60000 Seconds (1 Minute)
            commandUsed.delete(message.author.id);
        }, 60000);
        return;
    }
    let hasClearance = !(row.clearance == null || row.clearance === "none");
    if (row.optOut === 1) { //if User Opted Out...
        log_js_1.debug(`${message.author.username} does not wish for data to be `
            + `collected on them. Preserving this preference.`);
        await sql.deleteUser(message.author.id);
        let reply = (`Data on you has been deleted, ${message.author}. Your `
            + `preference to have your data collection prevented has been `
            + `preserved, however.`);
        if (hasClearance) {
            reply = (`Data on you has been deleted, ${message.author}. Your `
                + `clearance and preference to have your data collection prevented has been `
                + `preserved, however.`);
        }
        return message.author.send(reply).catch(error => {
            return disabledDMs_js_1.run(message, reply);
        });
    }
    deleteMemberInfo_js_1.run(bot, message.member, sql);
    let reply = (`Data on you has been deleted, ${message.author}.`);
    if (hasClearance) {
        reply = (`Data on you has been deleted, ${message.author}. `
            + `However, your clearance has been preserved`);
    }
    return message.author.send(reply).catch(error => {
        return disabledDMs_js_1.run(message, reply);
    });
}
exports.run = run;
exports.help = command;
