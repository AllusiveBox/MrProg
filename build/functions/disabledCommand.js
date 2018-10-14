"use strict";
/**

    cxBot.js Mr. Prog Disabled Command Script
    Version: 1
    Author: AllusiveBox
    Date Created: 08/09/18
    Date Last Updated: 10/10/18
    Last Update By: Th3_M4j0r

**/
Object.defineProperty(exports, "__esModule", { value: true });
const disabledDMs_1 = require("./disabledDMs");
const log_js_1 = require("./log.js");
const config = require("../files/config.json");
/**
 *
 * @param {string} commandName
 * @param {Discord.Message} message
 * @returns {Promise<void>}
 */
async function run(commandName, message) {
    // Debug to Console
    log_js_1.debug(`I am in the disabledMessage function.`);
    log_js_1.debug(`The ${commandName} command is currently disabled.\n`);
    message.author.send(config.disabledMessage).catch(error => {
        disabledDMs_1.run(message, config.disabledMessage);
    });
}
exports.run = run;
