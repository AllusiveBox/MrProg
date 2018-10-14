"use strict";
/*
    Command Name: petmax.js
    Function: Counts How Many Times Max has been Pet
    Clearance: none
    Default Enabled: Yes
    Date Created: 10/15/17
    Last Updated: 10/13/18
    Last Updated By: AllusiveBox

*/
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const config = require("../files/config.json");
// Command Variables
const command = {
    bigDescription: ("Give Max a pat on the head!\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Give Max a pat on the head!",
    enabled: true,
    fullName: "Pet Max",
    name: "petmax",
    permissionLevel: "normal"
};
/**
 *
 * @param {number} newCount
 * @param {Discord.Message} [message]
 */
function setCount(newCount, message) {
    // Debug to Console
    log_js_1.debug(`I am inside the petmax.setCount functon.`);
    // Get Counter
    try {
        var counter = require(`../files/counter.json`);
    }
    catch (error) {
        log_js_1.error(error);
        return message.channel.send(`*${error.toString()}*`);
    }
    counter.max.total = newCount;
    // Save Edited File
    fs_1.writeFile(`./files/counter.json`, JSON.stringify(counter), error => {
        if (error) {
            log_js_1.error(error);
            if (message) {
                return message.channel.send(`*${error.toString()}*`);
            }
            else {
                return;
            }
        }
    });
    // Save Successful
    return log_js_1.debug(`Successfully saved!`);
}
exports.setCount = setCount;
/**
 *
 * @param {Discord.Message} [message]
 */
function getCount(message) {
    // Debug to Console
    log_js_1.debug(`I am inside the petmax.getCount function.`);
    // Get Counter
    try {
        var counter = require(`../files/counter.json`);
    }
    catch (error) {
        log_js_1.error(error);
        return message.channel.send(`*${error.toString()}*`);
    }
    // Build the Reply
    let reply = `Current counter.max.total is: ${counter.max.total}`;
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
    // Increase Counter
    counter.max.total++;
    // Save Edited File
    fs_1.writeFile(`./files/counter.json`, JSON.stringify(counter), error => {
        if (error) {
            log_js_1.error(error);
            return message.channel.send(`*${error.toString()}*`);
        }
    });
    // Save Successful
    log_js_1.debug(`Successfully saved!`);
    // Build the Reply
    let reply = `${counter.max.total} `;
    if (counter.max.total > 1) {
        reply = (reply + "people have given Max a pat on the head.\n"
            + "Max is a good boy. Yes he is.");
    }
    else if (counter.max.total === 1) {
        reply = (reply + "person has given Max a pat on the head.");
    }
    else {
        reply = `How did you get here, ${message.author}? Please, don't do that again.`;
    }
    return message.channel.send(reply);
}
exports.run = run;
exports.help = command;
