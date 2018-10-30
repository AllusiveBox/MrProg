"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const config = require("../files/config.json");
const command = {
    bigDescription: ("Bot Replies \"gnip!\" Useful if you want to see if the bot is "
        + "active and accepting commands.\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Bot Replies \"gnip!\".",
    enabled: true,
    fullName: "Pong",
    name: "Pong",
    permissionLevel: "normal"
};
async function run(bot, message) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!command.enabled) {
        disabledCommand_js_1.run(command.name, message);
    }
    return message.channel.send("gnip!");
}
exports.run = run;
exports.help = command;
