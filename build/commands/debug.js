"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const userids = require("../files/userids.json");
const config = require("../files/config.json");
const command = {
    bigDescription: ("This command toggles the config.debug flag which determins if stuff are logged to the command prompt or not.\n"
        + "Returns:\n\t"
        + "This command returns nothing."),
    description: "Toggle the config.debug flag.",
    enabled: null,
    fullName: "Debug",
    name: "debug",
    permissionLevel: "owner"
};
async function run(bot, message) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (message.author.id !== userids.ownerID) {
        return log_js_1.debug(`Attempted use of ${command.fullName} by ${message.author.username}.`);
    }
    config.debug = !config.debug;
    await message.react(config.success);
    return log_js_1.debug(`Setting debug value to: ${config.debug}.`);
}
exports.run = run;
exports.help = command;
