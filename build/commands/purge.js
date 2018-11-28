"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const hasElevatedPermissions_js_1 = require("../functions/hasElevatedPermissions.js");
const log_js_1 = require("../functions/log.js");
const purge_js_1 = require("../functions/purge.js");
const react_js_1 = require("../functions/react.js");
const command = {
    adminOnly: true,
    bigDescription: ("This command bulk deletes messages from a channel.\n"
        + "Arguments:\n\t"
        + "@{user} (optional) -> The user to bulk delete messages of.\n\t"
        + "{int} -> The number of messages to delete. This caps at 100.\n\t"
        + "Returns:\n\t"
        + "On successful purge, a message will be logged."),
    description: "Purge commands from a channel.",
    enabled: true,
    fullName: "Purge",
    name: "purge",
    permissionLevel: "mod"
};
async function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.fullName, message);
    }
    if (dmCheck_js_1.run(message, command.fullName)) {
        return react_js_1.run(message, false);
    }
    if (!await hasElevatedPermissions_js_1.run(bot, message, command.adminOnly, sql, true))
        return;
    let amount = !!parseInt(message.content.split(" ")[1]) ? parseInt(message.content.split(" ")[1]) : parseInt(message.content.split(" ")[2]);
    let user = null;
    if (!amount) {
        log_js_1.debug(`No amount of messages was provided to delete.\n`);
        let reply = `${message.author}, you need to indicate a number of messages to purge!`;
        await react_js_1.run(message, false);
        return message.author.send(reply).catch(error => {
            return disabledDMs_js_1.run(message, reply);
        });
    }
    else if ((amount < 2) || (amount > 100)) {
        log_js_1.debug(`Amount range is invalid.`);
        let reply = `${message.author}, you please use a valid range. The allowed range is between 2 and 100.`;
        await react_js_1.run(message, false);
        return message.author.send(reply).catch(error => {
            return disabledDMs_js_1.run(message, reply);
        });
    }
    purge_js_1.run(bot, message, amount, user);
}
exports.run = run;
exports.help = command;
