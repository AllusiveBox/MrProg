"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const hasElevatedPermissions_js_1 = require("../functions/hasElevatedPermissions.js");
const command = {
    adminOnly: false,
    bigDescription: ("This command allows an administrator to enable a command that is disabled.\n"
        + "Returns:\n\t"
        + "This command returns nothing."),
    description: "Enables a command.",
    enabled: null,
    fullName: "Enable",
    name: "enable",
    permissionLevel: "mod"
};
async function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (args[0] === undefined)
        return log_js_1.debug(`No arguments passed.`);
    if (!await hasElevatedPermissions_js_1.run(bot, message, command.adminOnly, sql))
        return;
    let toEnable = args[0].toLocaleLowerCase();
    if (!toEnable) {
        return log_js_1.debug(`No arguments passed`);
    }
    if (toEnable == "music") {
        toEnable = "play";
    }
    try {
        var enabled = bot.commands.get(toEnable).help.enabled;
    }
    catch (error) {
        return log_js_1.error(error);
    }
    if (enabled === null)
        return log_js_1.debug(`This command cannot be disabled.`);
    log_js_1.debug(`Setting ${toEnable} to true.`);
    bot.commands.get(toEnable).help.enabled = true;
}
exports.run = run;
exports.help = command;
