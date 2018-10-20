"use strict";
/**
 *
 *  Mr. Prog Logging Script
 *  Version: 1
 *  Date Created: 09/21/18
 *  Last Updated: 10/13/18
 *  Last Updated By: Th3_M4j0r
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_js_1 = require("../classes/Logger.js");
const config = require("../files/config.json");
/**
 *
 * @param {string} string
 */
async function debugLogger(string) {
    let debug = new Logger_js_1.default("DebugLogger");
    debug.log(string, config.debug);
}
/**
 *
 * @param {Error | string} error
 */
async function errorLogger(error) {
    let errorLogger = new Logger_js_1.default("ErrorLogger");
    errorLogger.log(error.toString());
    if (typeof (error) !== "string")
        errorLogger.log(error.stack);
}
/**
 * @param {Discord.User} user
 * @param {string} command
 * @param {string[]} args
 */
async function commandLogger(user, command, args) {
    let commandLogger = new Logger_js_1.default("CommandLogger");
    // Build the Log Message
    let logMessage = `Command recieved from ${user.tag} to perform ${command}.`;
    commandLogger.log(logMessage);
    if (!args[0]) { // If No Arguments Passed...
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