"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hasElevatedPermissions_js_1 = require("../functions/hasElevatedPermissions.js");
const log_js_1 = require("../functions/log.js");
const react_js_1 = require("../functions/react.js");
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
async function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (args[0] === undefined)
        return log_js_1.debug(`No arguments passed.`);
    if (!await hasElevatedPermissions_js_1.run(bot, message, command.adminOnly, sql))
        return;
    let toDisable = args[0].toLocaleLowerCase();
    if (!toDisable) {
        return log_js_1.debug(`No arguments passed`);
    }
    if (toDisable == "music") {
        toDisable = "play";
    }
    try {
        var enabled = bot.commands.get(toDisable).help.enabled;
    }
    catch (error) {
        log_js_1.error(error);
        await react_js_1.run(message, false);
        return message.channel.send(`*${error.toString()}*`);
    }
    if (enabled === null)
        return log_js_1.debug(`This command cannot be disabled.`);
    log_js_1.debug(`Setting ${toDisable} to false.`);
    try {
        bot.commands.get(toDisable).help.enabled = false;
    }
    catch (error) {
        log_js_1.error(error);
        await react_js_1.run(message, false);
        return message.channel.send(`*${error.toString()}*`);
    }
    return react_js_1.run(message);
}
exports.run = run;
exports.help = command;
