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
async function dmLogger(message) {
    let dmLogger = new Logger_js_1.default("DMLogger");
    let logMessage = `DM From:\n\t\t\t\t\t${message.author.username} (id: ${message.author.id})\n\t\t\t\t`;
    try {
        logMessage += `Message content:\n\t\t\t\t\t`;
        logMessage += `${message.content}\n\t\t\t\t`;
        if (message.attachments.size > 0) {
            logMessage += `The following attachment(s) were included:\n\t\t\t\t\t`;
            message.attachments.forEach(function (attachment) {
                logMessage += `${attachment.filename}\n\t\t\t\t\t`;
                logMessage += `${attachment.proxyURL}\n\t\t\t\t`;
            });
        }
        dmLogger.log(logMessage);
    }
    catch (error) {
        return errorLogger(error);
    }
}
exports.debug = debugLogger;
exports.error = errorLogger;
exports.dmLog = dmLogger;
exports.command = commandLogger;
