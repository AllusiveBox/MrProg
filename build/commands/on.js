"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const react_js_1 = require("../functions/react.js");
const config = require("../files/config.json");
const userids = require("../files/userids.json");
const command = {
    bigDescription: ("Turns the Bot's status to online and sets the isOn flag to true.\n"
        + "Returns:\n\t"
        + "This command returns nothing"),
    description: "Sets the bot to online, responds to commands again",
    enabled: null,
    fullName: "On",
    name: "on",
    permissionLevel: "owner"
};
async function run(bot, message) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (config.isOn) {
        await react_js_1.run(message, false);
        return message.channel.send(`Unable to turn the bot on when it's already on.`);
    }
    let validUser = false;
    Object.keys(userids).forEach(function (key) {
        if (userids[key] === message.author.id) {
            return validUser = true;
        }
    });
    if (validUser) {
        log_js_1.debug(`${message.author.username} is switching the bot to 'on' state.`);
        bot.user.setStatus("online").catch(error => {
            log_js_1.error(error);
            message.author.send(`An unexpected error prevented me from updating my status...`
                + `Please try again in a few minutes.`);
            return react_js_1.run(message, false);
        });
        config.isOn = true;
        react_js_1.run(message);
    }
}
exports.run = run;
exports.help = command;
