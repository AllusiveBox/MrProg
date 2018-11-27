"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = require("../files/config.json");
const userids_json_1 = require("../files/userids.json");
const hasElevatedPermissions_js_1 = require("../functions/hasElevatedPermissions.js");
const log_js_1 = require("../functions/log.js");
const validate_js_1 = require("../functions/validate.js");
const command = {
    adminOnly: false,
    bigDescription: ("This command allows a user to get access to the bot's log files through Discord, without having to access the server."
        + "Arguments:\n\t"
        + ""
        + "Returns:\n\t" + config_json_1.returnsDM),
    description: "This command allows access to the bot's logging without needing access to the server.",
    enabled: null,
    fullName: "Log",
    name: "log",
    permissionLevel: "mod"
};
async function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!await hasElevatedPermissions_js_1.run(bot, message, command.adminOnly, sql))
        return;
    let logPath = ((args[0] != undefined) && (validate_js_1.validatePath(`./logs/${args[0]}`))) ? `./logs/${args[0]}` : `./logs/ErrorLogger`;
    if (message.author.id !== userids_json_1.ownerID) {
        log_js_1.debug(`Not owner, switching to CommandLogger...`);
        logPath = logPath.replace("ErrorLogger", "CommandLogger");
    }
    let currentDate = new Date();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();
    month = month < 10 ? '0' + month : month;
    let fileName = ((args[1] != undefined) && (validate_js_1.validateFileName(args[1]))) ? `${args[1]}.txt` : `${year}-${month}.txt`;
    message.author.send({ file: `${logPath}/${fileName}` });
}
exports.run = run;
exports.help = command;
