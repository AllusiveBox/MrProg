"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const userids = require("../files/userids.json");
const command = {
    bigDescription: ("This command turns the bot's status to invisible, and terminates the process with code 88, which will prevent the batch stript from restarting.\n"
        + "Returns:\n\t"
        + "This command returns nothing."),
    description: "Set bot's status to invisible and then terminates script.",
    enabled: null,
    fullName: "Die",
    name: "die",
    permissionLevel: "owner"
};
function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (message.author.id !== userids.ownerID) {
        return log_js_1.debug(`Attempted use of ${command.fullName} by ${message.author.username}.`);
    }
    else {
        log_js_1.debug(`Terminating Bot. Goodbye.`);
        bot.user.setStatus("invisible");
        sql.close();
        return process.exit(88);
    }
}
exports.run = run;
exports.help = command;
