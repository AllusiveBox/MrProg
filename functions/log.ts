/** 
 *  
 *  Mr. Prog Logging Script
 *  Version: 1
 *  Date Created: 09/21/18
 *  Last Updated: 10/13/18
 *  Last Updated By: Th3_M4j0r
 */

// Load in Required Libraries and Files
import * as Discord from 'discord.js';
import Logger from '../classes/Logger.js';
import config = require('../files/config.json');

/**
 * 
 * @param {string} string
 */
async function debugLogger(string: string) {
    let debug = new Logger("DebugLogger");

    debug.log(string, config.debug);
}

/**
 * 
 * @param {Error | string} error
 */
async function errorLogger(error: Error | string) {
    let errorLogger = new Logger("ErrorLogger");
    errorLogger.log(error.toString());
    if (typeof (error) !== "string")
        errorLogger.log(error.stack);
}

/**
 * @param {Discord.User} user
 * @param {string} command
 * @param {string[]} args
 */

async function commandLogger(user: Discord.User, command: string, args: string[]) {
    let commandLogger = new Logger("CommandLogger");

    // Build the Log Message
    let logMessage = `Command recieved from ${user.tag} to perform ${command}.`;

    commandLogger.log(logMessage);

    if (!args[0]) { // If No Arguments Passed...
        logMessage = `No arguments were included.`;
    } else {
        logMessage = `The following arguments were included: ${args}`;
    }

    commandLogger.log(`${logMessage}`);
}


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


export const debug = debugLogger;
export const error = errorLogger;
export const dmLog = dmLogger;
export const command = commandLogger;

//added here because every command imports this file already
export interface commandHelp {
    readonly bigDescription: string;
    readonly description: string;
    enabled: boolean | null;
    readonly fullName: string;
    readonly name: string;
    readonly permissionLevel: "mod" | "admin" | "owner" | "normal";
    readonly adminOnly?: boolean;
    [propname: string]: any;
}