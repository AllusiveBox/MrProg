"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const validate_js_1 = require("../functions/validate.js");
const config = require("../files/config.json");
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
async function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    let prefix = config.prefix;
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.name, message);
    }
    var battleCode = args.join(' ').toUpperCase();
    let validCode = validate_js_1.validateBattleCode(battleCode);
    if (!validCode) {
        log_js_1.debug(`Invalid Code by ${message.author.username}. Code ${battleCode} `
            + `is not valid.`);
        let reply = (`I am sorry, ${message.author}, that is an invalid code `
            + `format.\n`
            + `Valid characters are the numbers 0 - 9, and the characters A - E`);
        return message.author.send(reply).catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
    }
    log_js_1.debug(`Setting the Battlecode for ${message.author.username} to `
        + `${battleCode}.`);
    let row = await sql.getUserRow(message.author.id);
    if (!row) {
        log_js_1.debug(`${message.author.username} does not exist in the `
            + `database`);
        let reply = (`I am sorry, ${message.author}, I am unable to `
            + `locate you in the userinfo database. Please wait a few seconds `
            + `and then try again.\n`
            + `If you continue to see this message, please alert `
            + `${config.about.author}`);
        return message.author.send(reply).catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
    }
    if ((row.optOut === 1) && (!commandUsed.has(message.author.id))) {
        log_js_1.debug(`${message.author.username} does not wish for data to `
            + `be collected. Generating reply now.`);
        commandUsed.add(message.author.id);
        setTimeout(() => {
            commandUsed.delete(message.author.id);
        }, 60000);
        let reply = (`${message.author}, you currently have opted out`
            + ` of data collection.\n`
            + `If you really want to store your battlecode, use this command `
            + `again. Otherwise, no data will be stored.`);
        return message.author.send(reply).catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
    }
    log_js_1.debug(`Attempting to Update ${message.author.username}'s `
        + `Battlecode.`);
    try {
        sql.setBattleCode(message.author.id, battleCode);
    }
    catch (error) {
        log_js_1.error(error);
        let reply = (`I am sorry, ${message.author}, an `
            + `unexpected error occured. Please wait a few seconds and `
            + `then try again.\n`
            + `If you continue to see this message, please alert `
            + `${config.about.author}`);
        return message.author.send(reply).catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
    }
    try {
        await message.react('✅');
    }
    catch (error) {
        message.channel.send("could not react with that emoji");
        log_js_1.error(error);
    }
    return log_js_1.debug(`Battlecode successfully updated.`);
}
exports.run = run;
exports.help = command;
