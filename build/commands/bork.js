"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const log_js_1 = require("../functions/log.js");
const config = require("../files/config.json");
const userids = require("../files/userids.json");
var borkMaster = false;
const command = {
    bigDescription: ("If you bork at the bot, I wonder what will happen?\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Sometimes you bork at the bot, and sometimes the bot borks back...",
    enabled: true,
    fullName: "Bork",
    name: "bork",
    permissionLevel: "normal"
};
async function run(bot, message) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.fullName, message);
    }
    borkMaster = false;
    Object.keys(userids).forEach(function (key) {
        if (userids[key] === message.author.id) {
            return borkMaster = true;
        }
    });
    if (borkMaster) {
        message.channel.send(`Bork to you too, young master.`);
    }
    else {
        message.channel.send(`What did you just say to me, ${message.author}`
            + `? I'll have you know that I graduated at the top of my class in the `
            + `${bot.user.username} accademy. You better watch yourself, kiddo.`);
    }
}
exports.run = run;
exports.help = command;
