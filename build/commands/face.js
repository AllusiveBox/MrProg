"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const CustomErrors_js_1 = require("../classes/CustomErrors.js");
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const config = require("../files/config.json");
try {
    var text = fs_1.readFileSync(`./files/textfaces.txt`, `utf8`);
}
catch (error) {
    throw new CustomErrors_js_1.NoTextFacesDefined();
}
var rando = null;
var lastNum = null;
var textFaces = text.split(`\n`);
const command = {
    bigDescription: ("This command is used to get some funny textfaces."
        + "Arguments:\n\t"
        + "{int} -> An Integer that represents the face number you wish to receive."
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Get a funny textface.",
    enabled: true,
    fullName: "Text Face",
    name: "face",
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
function getTextFaces(num) {
    if ((num) && (isInt(num))) {
        if ((num > textFaces.length) || (num <= 0)) {
            return textFaces;
        }
        else {
            return textFaces[num + 1];
        }
    }
    else {
        return textFaces;
    }
}
exports.getTextFaces = getTextFaces;
async function run(bot, message, args) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.fullName, message);
    }
    if ((args[0] && (isInt(args[0])))) {
        if ((Number(args[0]) > textFaces.length) || (Number(args[0]) <= 0)) {
            log_js_1.debug(`Number was out of range. Generating Random Number.`);
            rando = randomIntFrom(0, textFaces.length - 1);
        }
        else {
            rando = Number(args[0]) - 1;
            log_js_1.debug(`Setting rando to: ${rando}`);
        }
    }
    else {
        rando = randomIntFrom(0, textFaces.length - 1);
    }
    log_js_1.debug(`Generating textFace for ${message.author.username}.`);
    message.channel.send(`textFace #${rando + 1}: ${textFaces[rando]}`);
    lastNum = rando;
}
exports.run = run;
exports.help = command;
