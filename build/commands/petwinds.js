"use strict";
/*
    Command Name: petwinds.js
    Function: Like petmax.js, but for Winds
    Clearance: None
    Default Enabled: Yes
    Date Created: 07/31/18
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
    bigDescription: ("Give Winds a pat on the head!\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Give Winds a pat on the head!",
    enabled: true,
    fullName: "Pet Winds",
    name: "petwinds",
    permissionLevel: "normal"
};
// Misc. Variables
const name = "Pet Winds";
/**
 *
 * @param {number} newCount
 * @param {Discord.Message} [message]
 */
function setCount(newCount, message) {
    // Debug to Console
    log_js_1.debug(`I am inside the petwinds.setCount functon.`);
    // Get Counter
    try {
        var counter = require(`../files/counter.json`);
    }
    catch (error) {
        log_js_1.error(error);
        return message.channel.send(`*${error.toString()}*`);
    }
    counter.winds.pets = newCount;
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
    if (message) {
        return message.channel.send(`counter.winds.pets set to: ${counter.winds.pets}`);
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
    let reply = `Current counter.winds.pets is: ${counter.winds.pets}`;
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
        return message.channel.send(`*${error.toString()}*`);
    }
    // Increase Counter
    counter.winds.pets++;
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
    let reply = (`Winds has been given ${counter.winds.pets} head pats.\n`
        + `You guys are weird...`);
    return message.channel.send(reply);
}
exports.run = run;
exports.help = command;
