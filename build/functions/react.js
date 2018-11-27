"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const config = require("../files/config.json");
async function run(message, success = true) {
    let react = success ? config.success : config.fail;
    try {
        await message.react(react);
    }
    catch (error) {
        log_js_1.error(error);
        return message.channel.send(`*${error.toString()}*`);
    }
}
exports.run = run;
