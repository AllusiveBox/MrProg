"use strict";
/*
    Command Name: rip.js
    Function: Pays respect to fallen Mr. Progs
    Clearance: none
    Default Enabled: Yes
    Date Created: 10/17/17
    Last Updated: 10/13/18
    Last Updated By: AllusiveBox

*/
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const config = require("../files/config.json");
var counter = getCounter(null);
// Command Stuff
const command = {
    bigDescription: ("Use this command to increase the rip counter.\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Pay respect to fallen Progs",
    enabled: true,
    fullName: "RIP",
    name: "rip",
    permissionLevel: "normal"
};
/**
 *
 * @param {?Discord.Message} [message]
 */
function getCounter(message) {
    // Get Counter
    try {
        counter = require(`../files/counter.json`);
    }
    catch (error) {
        log_js_1.error(error);
        return message.channel.send(`*${error.toString()}*`);
    }
    return counter;
}
/**
 *
 * @param {?Discord.Message} message
 */
function getCount(message) {
    // Debug to Console
    log_js_1.debug(`I am inside the rip.getCount function.`);
    let reply = `Current counter.rip.total is: ${counter.rip.total}`;
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
 * @param {?number} [newCount = null]
 * @param {?Discord.Message} [message = null]
 */
function setCount(newCount = null, message = null) {
    // Debug to Console
    log_js_1.debug(`I am inside the rip.setCount function.`);
    // Get the Counter
    let newCounter = counter;
    // Debug Before
    log_js_1.debug(`Previous counter.rip.total: ${newCounter.rip.total}`);
    if (newCount === null) { // If No newCount passed...
        // Increase RIP Count
        newCounter.rip.total++;
    }
    else {
        newCounter.rip.total = newCount;
    }
    // Debug After
    log_js_1.debug(`New counter.rip.total: ${newCounter.rip.total}`);
    // Save Edited File
    fs.writeFile(`./files/counter.json`, JSON.stringify(newCounter), error => {
        if (error) {
            log_js_1.error(error);
            if (message) { // If Message Param Passed...
                return message.channel.send(`*${error.toString()}*`);
            }
            return;
        }
    });
    // Save Successful
    log_js_1.debug(`Successfully saved!`);
    // Update command.counter
    counter = newCounter;
    return true;
}
exports.setCount = setCount;
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 */
async function run(bot, message) {
    // Debug to Console
    log_js_1.debug(`I am inside the ${command.name} command.`);
    // Enabled Command Test
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.name, message);
    }
    // Get Counter
    let newCounter = counter;
    // Check if Counter is Valid
    if (!newCounter)
        return;
    // Update the Counter
    setCount(null);
    // Build the Reply
    let reply = `${counter.rip.total} `;
    if (counter.rip.total > 1) {
        reply = (reply + "people have paid respect to fallen Mr. Progs.");
    }
    else if (counter.rip.total === 1) {
        reply = (reply + "person has paid respect to fallen Mr. Progs.");
    }
    else {
        reply = `How did you get here, ${message.author}? Please don't do that again.`;
    }
    return message.channel.send(reply);
}
exports.run = run;
exports.help = command;
