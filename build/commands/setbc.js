"use strict";
/*
    Command Name: setbc
    Function: sets a user's battlecode
    Clearance: None
    Default Enabled: Cannot be Disabled
    Date Created: 03/19/18
    Last Updated: 10/10/18
    Last Update By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const config = require("../files/config.json");
const command = {
    bigDescription: ("Allows a user to set their battlecode, which can be fetched "
        + `which can be fetched with the ${config.prefix}getBC command.\n`
        + "Returns:\n\t"
        + config.returnsDM),
    description: "Shorthand for SetBattlecode",
    enabled: null,
    fullName: "Set Battlecode",
    name: "setbc",
    permissionLevel: "normal"
};
/**
 *
 * @param {commandBot} bot
 * @param {Discord.Message} message
 * @param {string[]} [args]
 * @param {betterSql} sql
 */
function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.name} function`);
    bot.commands.get("setbattlecode").run(bot, message, args, sql);
}
exports.run = run;
exports.help = command;
