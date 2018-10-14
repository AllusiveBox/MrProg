"use strict";
/*
    Command Name: optin.js
    Function: Allows a User to Opt-In to data collection
    Clearance: none
    Default Enabled: Cannot be Disabled
    Date Created: 05/23/18
    Last Updated: 10/12/18
    Last Updated By: Th3_M4j0r
*/
Object.defineProperty(exports, "__esModule", { value: true });
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const log_js_1 = require("../functions/log.js");
const betterSql_js_1 = require("../classes/betterSql.js");
const config = require("../files/config.json");
// Command Required Files
const command = {
    bigDescription: ("Allows a user to opt back into data collection.\n"
        + "Returns:\n\t" + config.returnsDM),
    description: "Opts back in for data collection",
    enabled: null,
    fullName: "Opt-In",
    name: "optIn",
    permissionLevel: "normal"
};
/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {?string[]} [args]
 * @param {betterSql} sql
 */
async function run(client, message, args, sql) {
    // Debug to Console Log
    log_js_1.debug(`I am inside the ${command.fullName} Command.`);
    let row = await sql.getUserRow(message.author.id);
    if (!row) {
        log_js_1.debug(`Unable to locate any data for ${message.author.username}.`);
        let reply = `I am unable to locate any data on you. Please try again.`;
        return message.author.send(reply).catch(error => {
            return disabledDMs_js_1.run(message, reply);
        });
    }
    if (row.optOut === betterSql_js_1.optOutChoice.optedIn) { //if opted-in already
        log_js_1.debug(`${message.author.username} attempted to opt-in while already opted in.`);
        let reply = `You are already opted in, ${message.author}. `
            + `To opt out, use the ${config.prefix}optOut command.`;
        return message.author.send(reply).catch(error => {
            return disabledDMs_js_1.run(message, reply);
        });
    }
    //else 
    log_js_1.debug(`${message.author.username} is being opted in, resetting everything`);
    await sql.optInUser(message.author.id);
    if (row.points === null) { //if points are null, reset everything
        await sql.setPoints(message.author.id, 0, 0, message.author.username);
        await sql.setBattleCode(message.author.id, "0000-0000-0000");
        await sql.setNavi(message.author.id, "megaman");
    }
    let reply = `I have updated your preferences, ${message.author}. `
        + `If you wish to opt-out of future data collection `
        + `please use the ${config.prefix}optOut command.`;
    return message.author.send(reply).catch(error => {
        return disabledDMs_js_1.run(message, reply);
    });
}
exports.run = run;
exports.help = command;
