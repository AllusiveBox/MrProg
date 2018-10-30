"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const music_js_1 = require("../functions/music.js");
const config = require("../files/config.json");
const command = {
    bigDescription: ("Plays music the same voice channel as the user. "
        + "User must be in a voice channel\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Play a song in the voice channel",
    enabled: true,
    fullName: "Play",
    name: "play",
    permissionLevel: "normal"
};
async function run(bot, message, args) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (dmCheck_js_1.run(message, command.name)) {
        return;
    }
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.name, message);
    }
    let arg = args.join(" ");
    music_js_1.play(bot, message, arg).catch(error => {
        log_js_1.error(error);
    });
}
exports.run = run;
exports.help = command;
