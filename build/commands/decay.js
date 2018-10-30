"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disabledCommand_1 = require("../functions/disabledCommand");
const log_js_1 = require("../functions/log.js");
const config = require("../files/config.json");
const command = {
    bigDescription: ("This command brings forth a funny video showcasing the wrath of Decay.\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Summons the wrath of Decay from the voice channel!",
    enabled: true,
    fullName: "Decay",
    name: "decay",
    permissionLevel: "normal"
};
async function run(bot, message) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!command.enabled) {
        disabledCommand_1.run(command.fullName, message);
        return;
    }
    log_js_1.debug(`Generating Message for ${message.author.username}.\n`);
    message.channel.send(`https://www.youtube.com/watch?v=-d9M_AZqu8U`);
}
exports.run = run;
exports.help = command;
