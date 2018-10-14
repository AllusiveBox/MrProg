"use strict";
/*
    Command Name: join.js
    Function: joins a voice channel
    Clearance: none
    Default Enabled: enabled
    Date Created: 09/03/18
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
    bigDescription: ("Joins the same voice channel as the user. "
        + "User must be in a voice channel.\n"
        + "Returns:\n\t" + config.returnsChannel),
    description: "Join a voice channel",
    enabled: null,
    fullName: "Join",
    name: "join",
    permissionLevel: "normal"
};
/**
 *
 * @param {commandBot} bot
 * @param {Discord.Message} message
 */
async function run(bot, message) {
    //debug to console
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (dmCheck_js_1.run(message, command.fullName)) {
        return;
    }
    if (bot.commands.get("play").help.enabled === false) {
        return disabledCommand_js_1.run(command.name, message);
    }
    music_js_1.join(bot, message);
}
exports.run = run;
exports.help = command;
