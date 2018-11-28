"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const config = require("../files/config.json");
const roles = require("../files/roles.json");
var counter = getCounter(null);
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
function getCounter(message) {
    try {
        counter = require(`../files/counter.json`);
    }
    catch (error) {
        log_js_1.error(error);
        return message.channel.send(`*${error.toString()}*`);
    }
    return counter;
}
function getCount(message) {
    log_js_1.debug(`I am inside the rip.getCount function.`);
    let reply = `Current counter.rip.total is: ${counter.rip.total}`;
    if (message) {
        return message.channel.send(reply);
    }
    else {
        log_js_1.debug(reply);
        return reply;
    }
}
exports.getCount = getCount;
function setCount(newCount = null, message = null) {
    log_js_1.debug(`I am inside the rip.setCount function.`);
    let newCounter = counter;
    log_js_1.debug(`Previous counter.rip.total: ${newCounter.rip.total}`);
    if (newCount === null) {
        newCounter.rip.total++;
    }
    else {
        newCounter.rip.total = newCount;
    }
    log_js_1.debug(`New counter.rip.total: ${newCounter.rip.total}`);
    fs.writeFile(`./files/counter.json`, JSON.stringify(newCounter), error => {
        if (error) {
            log_js_1.error(error);
            if (message) {
                return message.channel.send(`*${error.toString()}*`);
            }
            return;
        }
    });
    log_js_1.debug(`Successfully saved!`);
    counter = newCounter;
    return true;
}
exports.setCount = setCount;
async function run(bot, message, args = null) {
    log_js_1.debug(`I am inside the ${command.name} command.`);
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.name, message);
    }
    if (message.mentions.everyone) {
        await message.member.addRole(roles.suspend.ID, "tried to get the bot to ping everyone");
        return;
    }
    if (args[0]) {
        let respectTo = args.slice(0).join(" ");
        return message.channel.send(`${message.author} has paid respect to ${respectTo}! RIP!`);
    }
    let newCounter = counter;
    if (!newCounter)
        return;
    setCount(null);
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
