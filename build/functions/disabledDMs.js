"use strict";
/**

    cxBot.js Mr. Prog Disabled DMs Script
    Version: 1
    Author: AllusiveBox
    Date Created: 08/09/18
    Date Last Updated: 10/10/18
    Last Update By: Th3_M4j0r

**/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("./log.js");
/**
 *
 * @param {Discord.Message} message
 * @param {string} reply
 */
async function run(message, reply) {
    // Debug to Console
    log_js_1.debug(`${message.author.username} has DMs disabled.`);
    if (!reply) { // If No Reply Provided...
        return log_js_1.debug(`No Reply Passed to disabledDMs function...`);
    }
    else { // If Reply Provided...
        return message.channel.send(reply);
    }
}
exports.run = run;
