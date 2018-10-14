"use strict";
/*
    Command Name: play.js
    Function: plays a song if in a voice channel
    Clearance: none
    Default Enabled: Yes
    Date Created: 09/06/18
    Last Updated: 10/10/18
    Last Update By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const music_js_1 = require("../functions/music.js");
const config = require("../files/config.json");
//misc variables
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
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string[]} args
 */
async function run(bot, message, args) {
    //debug to console
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
