"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const config = require("../files/config.json");
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
function setCount(newCount, message) {
    log_js_1.debug(`I am inside the petmax.setCount functon.`);
    try {
        var counter = require(`../files/counter.json`);
    }
    catch (error) {
        log_js_1.error(error);
        return message.channel.send(`*${error.toString()}*`);
    }
    counter.max.total = newCount;
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
    return log_js_1.debug(`Successfully saved!`);
}
exports.setCount = setCount;
function getCount(message) {
    log_js_1.debug(`I am inside the petmax.getCount function.`);
    try {
        var counter = require(`../files/counter.json`);
    }
    catch (error) {
        log_js_1.error(error);
        return message.channel.send(`*${error.toString()}*`);
    }
    let reply = `Current counter.max.total is: ${counter.max.total}`;
    if (message) {
        return message.channel.send(reply);
    }
    else {
        return log_js_1.debug(reply);
    }
}
exports.getCount = getCount;
async function run(bot, message) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.name, message);
    }
    try {
        var counter = require(`../files/counter.json`);
    }
    catch (error) {
        log_js_1.error(error);
        let reply = (`No counter.json file was able to be located. `
            + `Please ensure that there is a files/counter.json file and that it `
            + `is in the right directory.`);
        log_js_1.debug(reply);
        return message.channel.send(reply);
    }
    counter.max.total++;
    fs_1.writeFile(`./files/counter.json`, JSON.stringify(counter), error => {
        if (error) {
            log_js_1.error(error);
            return message.channel.send(`*${error.toString()}*`);
        }
    });
    log_js_1.debug(`Successfully saved!`);
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
