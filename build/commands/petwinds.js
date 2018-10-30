"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const config = require("../files/config.json");
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
const name = "Pet Winds";
function setCount(newCount, message) {
    log_js_1.debug(`I am inside the petwinds.setCount functon.`);
    try {
        var counter = require(`../files/counter.json`);
    }
    catch (error) {
        log_js_1.error(error);
        return message.channel.send(`*${error.toString()}*`);
    }
    counter.winds.pets = newCount;
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
function getCount(message) {
    log_js_1.debug(`I am inside the petmax.getCount function.`);
    try {
        var counter = require(`../files/counter.json`);
    }
    catch (error) {
        log_js_1.error(error);
        return message.channel.send(`*${error.toString()}*`);
    }
    let reply = `Current counter.winds.pets is: ${counter.winds.pets}`;
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
        return message.channel.send(`*${error.toString()}*`);
    }
    counter.winds.pets++;
    fs_1.writeFile(`./files/counter.json`, JSON.stringify(counter), error => {
        if (error) {
            log_js_1.error(error);
            return message.channel.send(`*${error.toString()}*`);
        }
    });
    log_js_1.debug(`Successfully saved!`);
    let reply = (`Winds has been given ${counter.winds.pets} head pats.\n`
        + `You guys are weird...`);
    return message.channel.send(reply);
}
exports.run = run;
exports.help = command;
