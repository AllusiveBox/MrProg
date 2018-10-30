"use strict";
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
function run(bot, message, args, sql) {
    log_1.debug(`I am inside the ${command.name} function`);
    bot.commands.get("getbattlecode").run(bot, message, args, sql);
}
exports.run = run;
exports.help = command;
