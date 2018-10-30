"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disabledDMs_1 = require("./disabledDMs");
const log_js_1 = require("./log.js");
const config = require("../files/config.json");
async function run(commandName, message) {
    log_js_1.debug(`I am in the disabledMessage function.`);
    log_js_1.debug(`The ${commandName} command is currently disabled.\n`);
    message.author.send(config.disabledMessage).catch(error => {
        disabledDMs_1.run(message, config.disabledMessage);
    });
}
exports.run = run;
