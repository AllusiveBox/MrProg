"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const config = require("../files/config.json");
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
async function run(bot, message) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.fullName, message);
    }
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
