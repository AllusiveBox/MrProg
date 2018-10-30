"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_js_1 = require("../classes/Logger.js");
const config = require("../files/config.json");
async function debugLogger(string) {
    let debug = new Logger_js_1.default("DebugLogger");
    debug.log(string, config.debug);
}
async function errorLogger(error) {
    let errorLogger = new Logger_js_1.default("ErrorLogger");
    errorLogger.log(error.toString());
    if (typeof (error) !== "string")
        errorLogger.log(error.stack);
}
async function commandLogger(user, command, args) {
    let commandLogger = new Logger_js_1.default("CommandLogger");
    let logMessage = `Command recieved from ${user.tag} to perform ${command}.`;
    commandLogger.log(logMessage);
    if (!args[0]) {
        logMessage = `No arguments were included.`;
    }
    else {
        logMessage = `The following arguments were included: ${args}`;
    }
    commandLogger.log(`${logMessage}`);
}
exports.debug = debugLogger;
exports.error = errorLogger;
exports.command = commandLogger;
