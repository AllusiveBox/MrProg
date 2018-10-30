"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const config = require("../files/config.json");
const command = {
    bigDescription: ("Provides a link to the staff page.\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Returns a link to the staff page.",
    enabled: true,
    fullName: "Staff",
    name: "staff",
    permissionLevel: "normal"
};
async function run(bot, message) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.name, message);
    }
    let reply = ("To find out more about our team, clink the following link:\n"
        + "<http://www.mmbnchronox.com/thestaff.php>");
    return message.channel.send(reply);
}
exports.run = run;
exports.help = command;
