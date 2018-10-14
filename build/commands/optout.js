"use strict";
/*
    Command Name: optout.js
    Function: opt out from data collection
    Clearance: none
    Default Enabled: Cannot be disabled
    Date Created: 05/23/18
    Last Updated: 10/12/18
    Last Update By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const log_js_1 = require("../functions/log.js");
const betterSql_js_1 = require("../classes/betterSql.js");
const config = require("../files/config.json");
// Command Required Files
const command = {
    bigDescription: ("Allows a user to opt out of data collection.\n"
        + "Returns:\n\t" + config.returnsDM),
    description: "Opts out of data collection",
    enabled: null,
    fullName: "Opt-Out",
    name: "optOut",
    permissionLevel: "normal"
};
/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {?string[]} [args]
 * @param {betterSql} sql
 */
async function run(bot, message, args, sql) {
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
    //else row found
    if (row.optOut === betterSql_js_1.optOutChoice.optedOut) { //if opted out
        log_js_1.debug(`${message.author.username} attempted to opt-out while already opted out.`);
        let reply = `You are already opted out, ${message.author}. `
            + `To opt back in, use the ${config.prefix}optIn command.`;
        return message.author.send(reply).catch(error => {
            return disabledDMs_js_1.run(message, reply);
        });
    }
    //not opted out
    log_js_1.debug(`${message.author.username} is being opted-out`);
    await sql.optOutUser(message.author.id);
    let reply = `No further data on you will be collected, `
        + `however if you want any existing data to be deleted, `
        + `use the ${config.prefix}deleteMe command. If you `
        + `wish to have data collected again, use the `
        + `${config.prefix}optIn command`;
    return message.author.send(reply).catch(error => {
        return disabledDMs_js_1.run(message, reply);
    });
}
exports.run = run;
exports.help = command;
