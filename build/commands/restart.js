"use strict";
/*
    Command Name: restart.js
    Function: Restarts the Bot
    Clearance: Owner Only
    Default Enabled: Cannot be Disabled
    Date Created: 07/18/18
    Last Updated: 10/10/18
    Last Update By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const config = require("../files/config.json");
const userids = require("../files/userids.json");
// Command Variables
// Command Variables
const ownerID = userids.ownerID;
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
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string[]} args
 * @param {betterSql} sql
 */
async function run(bot, message, args, sql) {
    // Debug to Console
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    let inUserList = false;
    // Check if Member is in User ID List
    Object.keys(userids).forEach(function (key) {
        if (userids[key] === message.author.id) { // If Member is in the User ID List...
            return inUserList = true;
        }
    });
    if (inUserList) { // If Member is In the User ID List...
        log_js_1.debug(`Shutting Down...`);
        sql.close();
        log_js_1.debug(`Database conection closed.`);
        log_js_1.debug(`Alerting Owner...`);
        if (!config.debug)
            message.author.send(`Restarting Now...`);
        setTimeout(() => {
            process.exit(0);
        }, 500);
    }
}
exports.run = run;
exports.help = command;