"use strict";
/*
    Command Name: getbc
    Function: returns a user's battlecode
    Clearance: None
    Default Enabled: Cannot be Disabled
    Date Created: 03/19/18
    Last Updated: 10/10/18
    Last Update By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("../functions/log");
const config = require("../files/config.json");
const command = {
    bigDescription: ("Returns a mentioned user's battle code. If no user is "
        + "mentioned, it will return the command user's battle code instead.\n"
        + "Returns:\n\t" + config.returnsChannel),
    description: "Shorthand for getbattlecode",
    enabled: null,
    fullName: "Get Battlecode",
    name: "getBC",
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
    log_1.debug(`I am inside the ${command.name} function`);
    bot.commands.get("getbattlecode").run(bot, message, args, sql);
}
exports.run = run;
exports.help = command;
