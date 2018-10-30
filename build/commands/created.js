"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const config = require("../files/config.json");
const command = {
    bigDescription: ("This command will return the date and time your account was created.\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Find out when your account was made.",
    enabled: null,
    fullName: "Created",
    name: "created",
    permissionLevel: "normal"
};
async function run(bot, message) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    let createdOn = await new Date((Number(message.author.id) / 4194304) + 1420070040000);
    message.channel.send(`Account created on: **${createdOn}**`)
        .catch(error => {
        log_js_1.error(error);
        return message.channel.send(`*${error.toString()}*`);
    });
}
exports.run = run;
exports.help = command;
