"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const config = require("../files/config.json");
const command = {
    bigDescription: ("Sends the Prog Smash gif.\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "PROG ANGRY. PROG SMASH!",
    enabled: true,
    fullName: "Prog Smash",
    name: "progsmash",
    permissionLevel: "normal"
};
async function run(bot, message) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!command.enabled) {
        disabledCommand_js_1.run(command.name, message);
    }
    return message.channel.send({ file: "./img/magicslam.gif" }).catch(error => {
        log_js_1.error(error);
        message.channel.send(`Unexpected error caused by ${message.author} when using the ${command.fullName} command.`);
    });
}
exports.run = run;
exports.help = command;
