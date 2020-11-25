/*
    Command Name: log.js
    Function: Returns the log text for a determined log file
    Clearance: mod+
	Default Enabled: Yes
    Date Created: 11/23/18
    Last Updated: 11/24/20
    Last Updated By: AllusiveBox

*/

// Load in Required Files
const Discord = require(`discord.js`);
const config = require(`../files/config.json`);
const userids = require(`../files/userids.json`);
const { run: hasElevatedPermissions } = require(`../functions/hasElevatedPermissions.js`);
const { debug, error: errorLog } = require(`../functions/log.js`);
const { validatePath, validateFileName } = require(`../functions/validate.js`);

// Command Variables
const command = {
    adminOnly : false,
    bigDescription: ("This command allows a user to get access to the bot's log files through Discord, without having to access the server."
        + "Arguments:\n\t"
        + ""
        + "Returns:\n\t" + config.returnsDM),
    description: "This command allows access to the bot's logging without needing access to the server.",
    enabled: null, 
    fullName: "Log",
    name: "log",
    permissionLevel: "mod"
}

/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 */

module.exports.run = async (bot, message, args, sql) => {
    // Debug to Console
    debug(`I am inside the ${command.fullName} command.`);

    // Permission Check
    if (! await hasElevatedPermissions(bot, message, command.adminOnly, sql)) return;

    let logPath = ((args[0] != undefined) && (validatePath(`./logs/${args[0]}`))) ? `./logs/${args[0]}` : `./logs/ErrorLogger`;

    if (message.author.id !== userids.ownerID) {
        debug(`Not owner, switching to CommandLogger...`);
        logPath = logPath.replace("ErrorLogger", "CommandLogger");
    }

    // Get the Default Date
    let currentDate = new Date();

    // Grab Month and Year
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();

    // Format Month
    month = month < 10 ? '0' + month : month;
    let fileName = ((args[1] != undefined) && (validateFileName(args[1]))) ? `${args[1]}.txt` : `${year}-${month}.txt`;

    message.author.send({
        files: [{
            attachment: `${logPath}/${fileName}`,
            name: `${fileName}`
        }]
    });
}

module.exports.help = command;