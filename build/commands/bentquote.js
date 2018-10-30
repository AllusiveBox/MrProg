"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const CustomErrors_js_1 = require("../classes/CustomErrors.js");
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const config = require("../files/config.json");
try {
    var text = fs_1.readFileSync(`./files/bentcomments.txt`, `utf8`);
}
catch (error) {
    throw new CustomErrors_js_1.NoBentQuotesDefined();
}
var rando = null;
var lastNum = null;
var bentComments = text.split(`\n`);
const command = {
    bigDescription: ("This command is used to get funny quotes that have been said in the server."
        + "Arguments:\n\t"
        + "{int} -> An Integer that represents the quote number you wish to receive."
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Get a funny quote that was said in the server.",
    enabled: true,
    fullName: "Bent Quote",
    name: "bentquote",
    permissionLevel: "normal"
};
function randomIntFrom(min, max) {
    max = max | 0;
    min = min | 0;
    while (rando === lastNum) {
        rando = Math.floor(Math.random() * (max - min + 1) + min);
    }
    log_js_1.debug(`Setting rando to: ${rando}`);
    return rando | 0;
}
function isInt(value) {
    if (isNaN(value))
        return false;
    return true;
}
function getBentComments(num) {
    if ((num) && (isInt(num))) {
        if ((num > bentComments.length) || (num <= 0)) {
            return bentComments;
        }
        else {
            return bentComments[num + 1];
        }
    }
    else {
        return bentComments;
    }
}
async function run(bot, message, args) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.fullName, message);
    }
    if ((args[0] && (isInt(args[0])))) {
        if ((Number(args[0]) > bentComments.length) || (Number(args[0]) <= 0)) {
            log_js_1.debug(`Number was out of range. Generating Random Number.`);
            rando = randomIntFrom(0, bentComments.length - 1);
        }
        else {
            rando = Number(args[0]) - 1;
            log_js_1.debug(`Setting rando to: ${rando}`);
        }
    }
    else {
        rando = randomIntFrom(0, bentComments.length - 1);
    }
    log_js_1.debug(`Generating BentQuote for ${message.author.username}.`);
    message.channel.send(`BentQuote #${rando + 1}: ${bentComments[rando]}`);
    lastNum = rando;
}
exports.run = run;
exports.help = command;
const _getBentComments = getBentComments;
exports.getBentComments = _getBentComments;
