/*
    Command Name: beep
    Function: To beep at users
    Clearance: none
	Default Enabled: Yes
    Date Created: 02/18/19
    Last Updated: 02/21/19
    Last Updated By: AllusiveBox

*/

// Load in Required Files
const Discord = require(`discord.js`);
const { run: disabledCommand } = require(`../functions/disabledCommand.js`);
const { debug, error: errorLog } = require(`../functions/log.js`);
let usedRecently = new Set();

// Command Variables
const command = {
    bigDescription: ("Have you ever wondered what would happen if, instead of dooting, you were to beep? Find out with this nifty command."),
    description: "Beep",
    enabled: true, // true/false
    fullName: "Beep",
    name: "beep",
    permissionLevel: "normal"
}

/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 */

module.exports.run = async (bot, message) => {
    // Debug to Console
    debug(`I am inside the ${command.fullName} command.`);

    // Enabled Command Test
    if (!command.enabled) {
        return disabledCommand(command.fullName, message);
    }

    if (usedRecently.size > 0) { // If USed Recently...
        return message.channel.send("Beep!");
    } else {
        usedRecently.add(message.author.id);
        setTimeout(function () {
            usedRecently.delete(message.author.id);
        }, 300000);
    }

    try {
        return message.channel.send("Beeeeeep!", { file: "./img/beep.jpg" });
    } catch (error) {
        errorLog(error);
        return message.channel.send(`Unable to beep due to error:\n`
            + `${error.toString()}`);
    }
}

module.exports.help = command;