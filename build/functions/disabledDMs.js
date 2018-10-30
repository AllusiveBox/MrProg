"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("./log.js");
async function run(message, reply) {
    log_js_1.debug(`${message.author.username} has DMs disabled.`);
    if (!reply) {
        return log_js_1.debug(`No Reply Passed to disabledDMs function...`);
    }
    else {
        return message.channel.send(reply);
    }
}
exports.run = run;
