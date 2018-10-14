"use strict";
/*
    Command Name: patnet.js
    Function: Counts How Many Times Net has been Patted
    Clearance: none
    Default Enabled: Yes
    Date Created: 10/11/18
    Last Updated: 10/11/18
    Last Updated By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const config = require("../files/config.json");
// Command Variables
const command = {
    bigDescription: ("Give ProfNet a pat on the head!\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Give ProfNet a pat on the head!",
    enabled: true,
    fullName: "Pat Net",
    name: "patnet",
    permissionLevel: "normal"
};
/**
 *
 * @param {number} newCount
 * @param {Discord.Message} [message]
 */
function setCount(newCount, message) {
    // Debug to Console
    log_js_1.debug(`I am inside the patnet.setCount functon.`);
    // Get Counter
    try {
        var counter = require(`../files/counter.json`);
    }
    catch (error) {
        log_js_1.error(error);
        // Build the Reply
        let reply = (`No counter.json file was able to be located. `
            + `Please ensure that there is a files/counter.json file and that it `
            + `is in the right directory.`);
        log_js_1.debug(reply);
        return message.channel.send(reply);
    }
    counter.net.total = newCount;
    // Save Edited File
    fs_1.writeFile(`./files/counter.json`, JSON.stringify(counter), error => {
        if (error) {
            log_js_1.error(error);
            if (message) {
                return message.channel.send(`I was unable to update the counter. Please check the error log.`);
            }
            else {
                return;
            }
        }
    });
    if (message) {
        return message.channel.send(`counter.net.total set to: ${counter.net.total}`);
    }
    else {
        return;
    }
}
exports.setCount = setCount;
/**
 *
 * @param {Discord.Message} [message]
 */
function getCount(message) {
    // Debug to Console
    log_js_1.debug(`I am inside the patnet.getCount function.`);
    // Get Counter
    try {
        var counter = require(`../files/counter.json`);
    }
    catch (error) {
        log_js_1.error(error);
        // Build the Reply
        let reply = (`No counter.json file was able to be located. `
            + `Please ensure that there is a files/counter.json file and that it `
            + `is in the right directory.`);
        log_js_1.debug(reply);
        return message.channel.send(reply);
    }
    // Build the Reply
    let reply = `Current counter.net.total is: ${counter.net.total}`;
    if (message) {
        return message.channel.send(reply);
    }
    else {
        return log_js_1.debug(reply);
    }
}
exports.getCount = getCount;
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 */
async function run(bot, message) {
    // Debug to Console
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    // Enabled Command Test
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.name, message);
    }
    // Get Counter
    try {
        var counter = require(`../files/counter.json`);
    }
    catch (error) {
        log_js_1.error(error);
        // Build the Reply
        let reply = (`No counter.json file was able to be located. `
            + `Please ensure that there is a files/counter.json file and that it `
            + `is in the right directory.`);
        log_js_1.debug(reply);
        return message.channel.send(reply);
    }
    // Debug Before
    log_js_1.debug(`Previous net.total: ${counter.net.total}.`);
    // Increase Counter
    counter.net.total++;
    // Debug After
    log_js_1.debug(`New net.total: ${counter.net.total}.`);
    // Save Edited File
    fs_1.writeFile(`./files/counter.json`, JSON.stringify(counter), error => {
        if (error) {
            log_js_1.error(error);
            return message.channel.send(`I am sorry, ${message.author}, there was an unexpected error. I was unable to pet Max...`);
        }
    });
    // Save Successful
    log_js_1.debug(`Successfully saved!`);
    // Build the Reply
    let reply = `${counter.max.total} `;
    if (counter.max.total > 1) {
        reply = (reply + "people have given Net a pat on the head.\n"
            + "How cute");
    }
    else if (counter.max.total === 1) {
        reply = (reply + "person has given Net a pat on the head.");
    }
    else {
        reply = `How did you get here, ${message.author}? Please, don't do that again.`;
    }
    return message.channel.send(reply);
}
exports.run = run;
exports.help = command;
