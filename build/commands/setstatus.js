"use strict";
/*
    Command Name: setstatus.js
    Function: Changes the Bot's Status
    Clearance: Admin+
    Default Enabled: Cannot be Disabled
    Date Created: 10/27/17
    Last Updated: 10/11/18
    Last Updated By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const hasElevatedPermissions_js_1 = require("../functions/hasElevatedPermissions.js");
const validate_js_1 = require("../functions/validate.js");
const config = require("../files/config.json");
const command = {
    bigDescription: ("This command is used to update the bot's status (what the bot is currently 'streaming').\n"
        + "Required arguments: {string} -> The string of text you want to change the bot's status to.\n"
        + "Returns:\n\t"
        + config.returnsDM),
    description: "Changes the bot's status.",
    enabled: null,
    adminOnly: true,
    fullName: "Set Status",
    name: "setstatus",
    permissionLevel: "admin"
};
/**
 *
 * @param {Discord.Client} bot
 * @param {string} [newStatus]
 * @param {Discord.ActivityType} [method]
 * @param {string} [url]
 * @returns {boolean}
 */
function updateStatus(bot, newStatus = config.defaultStatus, method = "PLAYING", url = null) {
    // Validate Method
    validate_js_1.methodType(method);
    bot.user.setActivity(newStatus, { url: url, type: method }).then(presence => {
        log_js_1.debug(`Status updated to: ${newStatus}`);
    }).catch(error => {
        log_js_1.error(error);
        return false;
    });
    return true;
}
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string[]} args
 */
async function run(bot, message, args, sql) {
    // Debug to Console
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!await hasElevatedPermissions_js_1.run(bot, message, command.adminOnly, sql))
        return;
    // Join the additional arguments into the status
    let status = args.join(" ");
    let success = updateStatus(bot, status);
    if (success) {
        let reply = `Status was successfully updated.`;
        return message.author.send(reply).catch(error => {
            disabledCommand_js_1.run(command.name, message);
        });
    }
    else {
        let reply = (`I am sorry, ${message.author}, something went wrong and I was unable to update the status.\n`
            + `Please wait a few seconds and then try again.`);
        return message.author.send(reply).catch(error => {
            disabledCommand_js_1.run(command.name, message);
        });
    }
}
exports.run = run;
exports.help = command;
const _updateStatus = updateStatus;
exports.updateStatus = _updateStatus;
