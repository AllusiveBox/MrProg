"use strict";
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
function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.name} function`);
    bot.commands.get("setbattlecode").run(bot, message, args, sql);
}
exports.run = run;
exports.help = command;
