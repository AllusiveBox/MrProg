"use strict";
/*
    Command Name: die.js
    Function: Set bot status to invisible and stops accepting commands
    Clearance: Owner Only.
    Default Enabled: Cannot be Disabled
    Date Created: 10/27/17
    Last Updated: 10/10/18
    Last Update By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const userids = require("../files/userids.json");
// Command Variables
const command = {
    bigDescription: ("This command turns the bot's status to invisible, and terminates the process with code 88, which will prevent the batch stript from restarting.\n"
        + "Returns:\n\t"
        + "This command returns nothing."),
    description: "Set bot's status to invisible and then terminates script.",
    enabled: null,
    fullName: "Die",
    name: "die",
    permissionLevel: "owner"
};
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string[]} [args]
 * @param {betterSql} sql
 */
function run(bot, message, args, sql) {
    // Debug to Console
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    // Owner ID Check
    if (message.author.id !== userids.ownerID) { // If Not Owner...
        return log_js_1.debug(`Attempted use of ${command.fullName} by ${message.author.username}.`);
    }
    else {
        log_js_1.debug(`Terminating Bot. Goodbye.`);
        // Set Bot Status to Invisible, in Case Bot Doesn't Disconnect Right Away.
        bot.user.setStatus("invisible");
        // Cleanly Close the SQL Database
        sql.close();
        // Exit the Process, and Return an Error Code that Will Prevent Scripts from
        // Restarting, should they be set to automatically reboot the bot if it
        // Terminates. In this case, I Chose Error Code 88, but it could be anything
        return process.exit(88);
    }
}
exports.run = run;
exports.help = command;
