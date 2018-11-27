"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const react_js_1 = require("../functions/react.js");
const config = require("../files/config.json");
const command = {
    bigDescription: ("Returns when the user had joined the server.\n"
        + "Returns\n\t" + config.returnsDM),
    description: "Returns user's join date",
    enabled: null,
    fullName: "Join Date",
    name: "joindate",
    permissionLevel: "normal"
};
async function run(bot, message) {
    log_js_1.debug(`I am in the ${command.fullName} command.`);
    if (await dmCheck_js_1.run(message, command.fullName))
        return;
    let reply = (`You joined the server on: **${message.member.joinedAt}**.`);
    await react_js_1.run(message);
    return message.author.send(reply).catch(error => {
        disabledDMs_js_1.run(message, reply);
    });
}
exports.run = run;
exports.help = command;
