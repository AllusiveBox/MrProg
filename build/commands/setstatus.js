"use strict";
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
function updateStatus(bot, newStatus = config.defaultStatus, method = "PLAYING", url = null) {
    validate_js_1.methodType(method);
    bot.user.setActivity(newStatus, { url: url, type: method }).then(presence => {
        log_js_1.debug(`Status updated to: ${newStatus}`);
    }).catch(error => {
        log_js_1.error(error);
        return false;
    });
    return true;
}
async function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!await hasElevatedPermissions_js_1.run(bot, message, command.adminOnly, sql))
        return;
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
