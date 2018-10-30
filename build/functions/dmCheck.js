"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const log_js_1 = require("../functions/log.js");
const config = require("../files/config.json");
function run(message, name) {
    if (message.channel.type === "dm") {
        log_js_1.debug(`${name} command was used by ${message.author.username} in a DM.`);
        let invalidChannel = config.invalidChannel;
        message.author.send(invalidChannel).catch(error => {
            disabledDMs_js_1.run(message, invalidChannel);
        });
        return true;
    }
    return false;
}
exports.run = run;
function check(message, name) {
    if (message.channel.type === "dm") {
        log_js_1.debug(`${name} command was used by ${message.author.username} in a DM.`);
        return true;
    }
    else {
        return false;
    }
}
exports.check = check;
