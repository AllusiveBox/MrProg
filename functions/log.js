﻿/** 
 *  
 *  Mr. Prog Logging Script
 *  Version: 1
 *  Date Created: 09/21/18
 *  Last Updated: 10/08/18
 *  Last Updated By: AllusiveBox
 *
 */

// Load in Required Libraries and Files
const Logger = require(`../classes/Logger.js`);
const config = require(`../files/config.json`);

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

    //errorLogger.log(error);
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

module.exports.debug = debugLogger;
module.exports.error = errorLogger;
module.exports.command = commandLogger;
module.exports.dmLog = dmLogger;