"use strict";
/*
    Command Name: setbattlecode
    Function: Set's a user's Battle Mate Code in the userinfo file
    Clearance: none
    Default Enabled: true
    Date Created: 11/04/17
    Last Updated: 10/10/18
    Last Update By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const validate_js_1 = require("../functions/validate.js");
const config = require("../files/config.json");
// Command Variables
/**
 * @type {Set<Discord.Snowflake>}
 */
const commandUsed = new Set();
const command = {
    bigDescription: ("Allows a user to set their battlecode, which can be fetched "
        + `which can be fetched with the getBattleCode command.\n`
        + "Returns:\n\t"
        + config.returnsDM),
    description: "Sets your battlecode",
    enabled: true,
    fullName: "Set Battlecode",
    name: "setbattlecode",
    permissionLevel: "normal"
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
    // Update Command Prefix
    let prefix = config.prefix;
    // Enabled Command Test
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.name, message);
    }
    // Get the Battlecode
    var battleCode = args.join(' ').toUpperCase();
    // Check if Battlecode is Valid
    let validCode = validate_js_1.validateBattleCode(battleCode);
    if (!validCode) { // If Code is Not Valid...
        log_js_1.debug(`Invalid Code by ${message.author.username}. Code ${battleCode} `
            + `is not valid.`);
        // Build the Reply Message
        let reply = (`I am sorry, ${message.author}, that is an invalid code `
            + `format.\n`
            + `Valid characters are the numbers 0 - 9, and the characters A - E`);
        return message.author.send(reply).catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
    }
    // IF Code Was Valid...
    log_js_1.debug(`Setting the Battlecode for ${message.author.username} to `
        + `${battleCode}.`);
    // SQL Stuff
    let row = await sql.getUserRow(message.author.id);
    if (!row) { // If Row Not Found...
        log_js_1.debug(`${message.author.username} does not exist in the `
            + `database`);
        // Build the Reply Message
        let reply = (`I am sorry, ${message.author}, I am unable to `
            + `locate you in the userinfo database. Please wait a few seconds `
            + `and then try again.\n`
            + `If you continue to see this message, please alert `
            + `${config.about.author}`);
        return message.author.send(reply).catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
    }
    // Else Row Was Found...
    if ((row.optOut === 1) && (!commandUsed.has(message.author.id))) {
        // If User Opts Out...
        log_js_1.debug(`${message.author.username} does not wish for data to `
            + `be collected. Generating reply now.`);
        // Update the Set
        commandUsed.add(message.author.id);
        setTimeout(() => {
            // Removes User from the Set after 60000 Seconds (1 Minte)
            commandUsed.delete(message.author.id);
        }, 60000);
        // Build the Reply Message
        let reply = (`${message.author}, you currently have opted out`
            + ` of data collection.\n`
            + `If you really want to store your battlecode, use this command `
            + `again. Otherwise, no data will be stored.`);
        return message.author.send(reply).catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
    } // User Allows Data Collection...
    log_js_1.debug(`Attempting to Update ${message.author.username}'s `
        + `Battlecode.`);
    try {
        sql.setBattleCode(message.author.id, battleCode);
    }
    catch (error) {
        log_js_1.error(error);
        // Build the Reply Message
        let reply = (`I am sorry, ${message.author}, an `
            + `unexpected error occured. Please wait a few seconds and `
            + `then try again.\n`
            + `If you continue to see this message, please alert `
            + `${config.about.author}`);
        return message.author.send(reply).catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
    }
    // Build the Reply Message
    let reply = (`${message.author}, your battlecode has been `
        + `updated to: ${battleCode}`);
    message.author.send(reply).catch(error => {
        disabledDMs_js_1.run(message, reply);
    });
    return log_js_1.debug(`Battlecode successfully updated.`);
}
exports.run = run;
exports.help = command;
