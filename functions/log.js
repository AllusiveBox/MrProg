/** 
 *  
 *  Mr. Prog Logging Script
 *  Version: 2
 *  Date Created: 09/21/18
 *  Last Updated: 04/10/19
 *  Last Updated By: AllusiveBox
 *
 */

// Load in Required Libraries and Files
const Logger = require('../classes/Logger.js');
const config = require('../files/config.json');

/**
 * 
 * @param {string} string
 */

async function debugLogger(string) {
    let debug = new Logger("DebugLogger");

    debug.log(string, config.debug);
}

/**
 * 
 * @param {string} error
 */

async function errorLogger(error) {
    let errorLogger = new Logger("ErrorLogger");

    errorLogger.log(error.stack);
}

/**
 * @param {Discord.User} user
 * @param {string} command
 * @param {string[]} args
 */

async function commandLogger(user, command, args) {
    let commandLogger = new Logger("CommandLogger");

    // Build the Log Message
    let logMessage = `Command recieved from ${user} to perform ${command}.`;

    commandLogger.log(logMessage);

    if (!args[0]) { // If No Arguments Passed...
        logMessage = `No arguments were included.`;
    } else {
        logMessage = `The following arguments were included: ${args}`;
    }

    commandLogger.log(`${logMessage}`);
}

/**
 * 
 * @param {Discord.Message} message
 */

async function dmLogger(message) {
    let dmLogger = new Logger("DMLogger");

    // Build the Log Message
    let logMessage = `DM From:\n\t\t\t\t\t${message.author.username} (id: ${message.author.id})\n\t\t\t\t`;

    try {
        logMessage += `Message content:\n\t\t\t\t\t`;
        logMessage += `${message.content}\n\t\t\t\t`;
        if (message.attachments.size > 0) { // If an Attachment was Included...
            logMessage += `The following attachment(s) were included:\n\t\t\t\t\t`
            message.attachments.forEach(function (attachment) {
                logMessage += `${attachment.filename}\n\t\t\t\t\t`;
                logMessage += `${attachment.proxyURL}\n\t\t\t\t`;
            });
        }

        dmLogger.log(logMessage);
    } catch (error) {
        return errorLogger(error);
    }
}

/**
 * 
 * @param {Discord.Message} message
 * @param {?String} [logType="info"]
 * @return {String}
 */

var bootLog;
function bootLogger(message, logType = "info") {
    let bootLogger = new Logger("BootLogger");
    bootLog = bootLog ? bootLog : "";
    if (!message) return bootLog;
    switch (logType) {
        case "info":
            bootLogger.info(message);
            bootLog +=  `[ INFO  ]\t ${message}\n`
            break;
        case "warn":
            bootLogger.warn(message);
            bootLog += `[ WARN  ]\t ${message}\n`
            break;
        case "alert":
            bootLogger.alert(message);
            bootLog += `[ ALERT ]\t ${message}\n`
            break;
        case "error":
            bootLogger.error(message);
            bootLog += `[ ERROR ]\t ${message}\n`
            break;
        case "none":
            bootLogger.none(message);
            bootLog += message;
            break;
        default:
            console.log(`[UNKNOWN]\t ${message}`);
            bootLog += `[UNKNOWN]\t ${message}\n`
            break;
    }
    return bootLog;
}

module.exports.debug = debugLogger;
module.exports.error = errorLogger;
module.exports.command = commandLogger;
module.exports.dmLog = dmLogger;
module.exports.boot = bootLogger;