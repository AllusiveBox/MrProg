"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const react_js_1 = require("../functions/react.js");
const config = require("../files/config.json");
const userids = require("../files/userids.json");
const command = {
    bigDescription: ("Turns the Bot's status to invisible and sets the isOn flag to false.\n"
        + "Returns:\n\t"
        + "This command returns nothing"),
    description: "Sets the bot to invisible, ignores commands from most users",
    enabled: null,
    fullName: "Off",
    name: "off",
    permissionLevel: "owner"
};
async function run(bot, message) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!config.isOn) {
        await react_js_1.run(message, false);
        return message.channel.send(`Unable to turn the bot off when it's already off.`);
    }
    let validUser = false;
    Object.keys(userids).forEach(function (key) {
        if (userids[key] === message.author.id) {
            return validUser = true;
        }
    });
    if (validUser) {
        log_js_1.debug(`${message.author.username} is switching the bot to 'off' state.`);
        bot.user.setStatus("invisible").catch(error => {
            log_js_1.error(error);
            message.author.send(`An unexpected error prevented me from updating my status...Please try again in a few minutes.`);
            return react_js_1.run(message, false);
        });
        config.isOn = false;
        return react_js_1.run(message);
    }
}
exports.run = run;
exports.help = command;
