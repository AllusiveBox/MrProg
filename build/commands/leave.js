"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const music_js_1 = require("../functions/music.js");
const config = require("../files/config.json");
const command = {
    bigDescription: ("Leaves a voice channel. "
        + "User must be in the same voice channel, or a mod\n"
        + "Returns:\n\t" + config.returnsChannel),
    description: "Leave a voice channel",
    enabled: null,
    fullName: "Leave",
    name: "leave",
    permissionLevel: "normal"
};
async function run(bot, message) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (dmCheck_js_1.run(message, command.fullName)) {
        return;
    }
    music_js_1.leave(bot, message).catch(error => {
        log_js_1.error(error);
    });
}
exports.run = run;
exports.help = command;
