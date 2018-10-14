"use strict";
/**

    cxBot.js Mr. Prog DM Checker
    Version: 1
    Author: AllusiveBox
    Date Created: 08/10/18
    Date Last Updated: 10/10/18
    Last Update By: Th3_M4j0r

**/
Object.defineProperty(exports, "__esModule", { value: true });
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const log_js_1 = require("../functions/log.js");
const config = require("../files/config.json");
/**
 *
 * Checks if they are in a DM channel
 * If it was a DM, tells the user it was an invalid channel
 * @param {Discord.Message} message
 * @param {string} name
 * @return {boolean} Returns True if In a DM
 */
function run(message, name) {
    if (message.channel.type === "dm") { // If Sent in DM...
        log_js_1.debug(`${name} command was used by ${message.author.username} in a DM.`);
        // Get Invalid Channel Message
        let invalidChannel = config.invalidChannel;
        message.author.send(invalidChannel).catch(error => {
            disabledDMs_js_1.run(message, invalidChannel);
        });
        return true;
    }
    return false;
}
exports.run = run;
/**
 *
 * Quiet verson of run
 * @param {Discord.Message} message
 * @param {string} name
 * @return {boolean} Returns True if In a DM
 */
function check(message, name) {
    if (message.channel.type === "dm") { // If Sent in DM...
        log_js_1.debug(`${name} command was used by ${message.author.username} in a DM.`);
        return true;
    }
    else {
        return false;
    }
}
exports.check = check;
