"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = require("../files/config.json");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const log_js_1 = require("../functions/log.js");
const command = {
    bigDescription: ("Sends a bigger oof!\n"
        + "Returns:\n\t" + config_json_1.returnsChannel),
    description: "Returns a big oof",
    enabled: true,
    fullName: "Big Oof!",
    name: "bigoof",
    permissionLevel: "normal"
};
async function run(bot, message) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.name, message);
    }
    try {
        return message.channel.send({ file: "./img/bigoof.png" });
    }
    catch (error) {
        log_js_1.error(error);
    }
}
exports.run = run;
exports.help = command;
