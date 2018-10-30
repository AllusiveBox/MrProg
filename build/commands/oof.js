"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const log_js_1 = require("../functions/log.js");
const config = require("../files/config.json");
const command = {
    bigDescription: ("Sends the Oof! picture\n"
        + "Returns:\n\t" + config.returnsChannel),
    description: "Returns an oof",
    enabled: true,
    fullName: "Oof!",
    name: "oof",
    permissionLevel: "normal"
};
async function run(bot, message) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.name, message);
    }
    return message.channel.send({ file: "./img/oof.png" }).catch(error => {
        log_js_1.error(error);
        message.channel.send(`Unexpected error caused by ${message.author} when using the ${command.name} command.`);
    });
}
exports.run = run;
exports.help = command;
