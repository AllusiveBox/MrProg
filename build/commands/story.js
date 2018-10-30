"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const config = require("../files/config.json");
const command = {
    bigDescription: ("Provides a link to the story page.\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Returns a link to the story page.",
    enabled: true,
    fullName: "Story",
    name: "story",
    permissionLevel: "normal"
};
async function run(bot, message) {
    log_js_1.debug(`I am inside the ${command.name} command.`);
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.name, message);
    }
    let reply = ("Want to know more about MegaMan Battle Network Chrono X? Check out the story so far with the following link:\n"
        + "<http://www.mmbnchronox.com/game.php>");
    return message.channel.send(reply);
}
exports.run = run;
exports.help = command;
