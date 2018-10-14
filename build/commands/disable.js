"use strict";
/*
    Command Name: disable.js
    Function: To disable a command
    Clearance: mod+
    Default Enabled: Cannot be Disabled
    Date Created: 10/19/17
    Last Updated: 10/10/18
    Last Update By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const hasElevatedPermissions_js_1 = require("../functions/hasElevatedPermissions.js");
const log_js_1 = require("../functions/log.js");
// Command Variables
const command = {
    adminOnly: false,
    bigDescription: ("This command allows an administrator to disable a command for any reason.\n"
        + "Returns:\n\t"
        + "This command returns nothing."),
    description: "Disables a command.",
    enabled: null,
    fullName: "Disable",
    name: "disable",
    permissionLevel: "mod"
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
    if (args[0] === undefined)
        return log_js_1.debug(`No arguments passed.`);
    if (!await hasElevatedPermissions_js_1.run(bot, message, command.adminOnly, sql))
        return;
    let toDisable = args[0].toLocaleLowerCase();
    if (!toDisable) { //no argument passed
        return log_js_1.debug(`No arguments passed`);
    }
    if (toDisable == "music") { //music is a special case
        toDisable = "play";
    }
    try {
        var enabled = bot.commands.get(toDisable).help.enabled;
    }
    catch (error) {
        return log_js_1.error(error);
    }
    if (enabled === null)
        return log_js_1.debug(`This command cannot be disabled.`);
    log_js_1.debug(`Setting ${toDisable} to false.`);
    return bot.commands.get(toDisable).help.enabled = false;
}
exports.run = run;
exports.help = command;
