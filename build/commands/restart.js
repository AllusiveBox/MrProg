"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const react_js_1 = require("../functions/react.js");
const config = require("../files/config.json");
const userids = require("../files/userids.json");
const command = {
    bigDescription: ("Restarts the bot to allow changes to take place.\n"
        + "Returns:\n\t"
        + "This command returns nothing"),
    description: "Restart the bot",
    enabled: null,
    fullName: "Restart",
    name: "restart",
    permissionLevel: "owner"
};
async function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    let inUserList = false;
    Object.keys(userids).forEach(function (key) {
        if (userids[key] === message.author.id) {
            return inUserList = true;
        }
    });
    if (inUserList) {
        log_js_1.debug(`Shutting Down...`);
        await sql.close();
        log_js_1.debug(`Database conection closed.`);
        log_js_1.debug(`Alerting Owner...`);
        if (!config.debug)
            message.author.send(`Restarting Now...`);
        await react_js_1.run(message);
        process.exit(0);
    }
}
exports.run = run;
exports.help = command;
