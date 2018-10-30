"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const disabledDMs_1 = require("../functions/disabledDMs");
const config = require("../files/config.json");
const command = {
    bigDescription: ("Returns information about me!\n"
        + "Returns:\n\t"
        + config.returnsDM),
    description: ("Returns informaton about the bot."),
    enabled: true,
    fullName: "About",
    name: "about",
    permissionLevel: "normal"
};
async function run(bot, message) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.fullName, message);
    }
    log_js_1.debug(`Generating About Message for ${message.author.username}`);
    let reply = (`Hello, my name is ${bot.user.username}! I was created by `
        + `${config.about.author}!\n\n`
        + `I am version: **${config.about.verNum}**.\n\n`
        + `I was last updated on: **${config.about.lastUpdated}**.\n\n`
        + `You can find my public github repo here: <${config.publicRepoLink}>\n\n`
        + `To report issues, please use the public issue repo here: <${config.issueRepoLink}>`);
    await message.react(config.success);
    return message.author.send(reply).catch(error => {
        return disabledDMs_1.run(message, reply);
    });
}
exports.run = run;
exports.help = command;
