"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const config = require("../files/config.json");
const command = {
    bigDescription: ("Provides a link to the wiki site.\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Returns a link to the wiki site.",
    enabled: true,
    fullName: "Wiki",
    name: "wiki",
    permissionLevel: "normal"
};
async function run(bot, message) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.name, message);
    }
    let reply = (`The official Chrono X Wiki can be found with the following link:\n`
        + `<http://mmbnchronox.wikia.com/wiki/MMBN_Chrono_X_Wiki>`);
    return message.channel.send(reply);
}
exports.run = run;
exports.help = command;
