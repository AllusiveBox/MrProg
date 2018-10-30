"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const config = require("../files/config.json");
const command = {
    bigDescription: ("Just google it, Lan...\n"
        + "Returns:\n\t" + config.returnsChannel),
    description: "Google it",
    enabled: true,
    fullName: "Google",
    name: "google",
    permissionLevel: "normal"
};
async function run(bot, message, args) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.name, message);
    }
    if (await (!dmCheck_js_1.check(message, command.name))) {
        message.delete().catch(error => {
            log_js_1.error(`Unable to purge command by ${message.author.username}.`);
        });
    }
    return message.channel.send({ file: "./img/google.png" });
}
exports.run = run;
exports.help = command;
