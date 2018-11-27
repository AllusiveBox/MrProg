"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const disabledCommand_1 = require("../functions/disabledCommand");
const react_js_1 = require("../functions/react.js");
const config = require("../files/config.json");
const inviteLink = config.n1gpLink;
const command = {
    bigDescription: ("Provides a link to the N1GP server.\n"
        + "Returns:\n\t" + config.returnsDM),
    description: "Sends a link to N1GP",
    enabled: true,
    fullName: "N1GP",
    name: "n1",
    permissionLevel: "normal"
};
async function run(bot, message) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!command.enabled) {
        return disabledCommand_1.run(command.name, message);
    }
    await react_js_1.run(message);
    return message.author.send(inviteLink).catch(error => {
        disabledDMs_js_1.run(message, inviteLink);
    });
}
exports.run = run;
exports.help = command;
