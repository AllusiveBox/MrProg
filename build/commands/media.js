"use strict";
/*
    Command Name: media.js
    Function: Returns Links to Our Social Media Sites
    Clearance: none
    Default Enabled: Yes
    Date Created: 10/15/17
    Last Updated: 10/10/18
    Last Update By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const config = require("../files/config.json");
// Command Stuff
const command = {
    bigDescription: ("Replies with a list of all of the Chrono X Media Links.\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Posts all CX social media",
    enabled: true,
    fullName: "Media",
    name: "media",
    permissionLevel: "normal"
};
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 */
async function run(bot, message) {
    // Debug to Console
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    // Enabled Command Test
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.fullName, message);
    }
    // Build Reply
    let reply = (`Want to keep in touch with us? Make sure to follow us on our social media platforms!\n`
        + "**deviantART**: <https://mmbnchronox.deviantart.com/> \n"
        + "**e-mail**: cxdevteam@gmail.com \n"
        + "**Facebook**: <https://www.facebook.com/MMBNChronoX/> \n"
        + "**Twitch**: <https://www.twitch.tv/mmbncx> \n"
        + "**Twitter**: <https://twitter.com/mmbncx> \n"
        + "**YouTube**: <https://youtube.com/rockflor> \n");
    message.channel.send(reply);
}
exports.run = run;
exports.help = command;
