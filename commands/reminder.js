/*
    Command Name: reminder.js
    Function: Sends a reminder that DMs are logged
    Clearance: none
	Default Enabled: Yes
    Date Created: 03/27/19
    Last Updated: 03/27/19
    Last Updated By: AllusiveBox

*/

// Load in Required Files
const Discord = require(`discord.js`);
const { run: disabledCommand } = require(`../functions/disabledCommand.js`);
const { run: disabledDMs } = require(`../functions/disabledDMs.js`);
const { debug, error: errorLog } = require(`../functions/log.js`);
let usedRecently = new Set();

// Command Variables
const command = {
    bigDescription: ("Sends both an image and text reminder that the bot logs DMs that users send to it."),
    description: "Big brother is watching...",
    enabled: true,
    fullName: "Reminder",
    name: "reminder",
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

    if (usedRecently.has(message.author.id)) { // If user has used Command Recently...
        let reply = `Friendly reminder that ${bot.user.username} is watching you, ${message.author}.`
        try {
            return message.author.send(reply, { file: "./img/bigBrother.png" });
        } catch (error) {
            if (error.toString().includes("Cannot send message to this user")) {
                let reply = `I am sorry, ${message.author}, I am unable to DM you.\n`
                    + `Please check your privacy settings and try again.`;
                return disabledDMs(message, reply);
            } else {
                errorLog(error);
                return message.channel.send(`Error:\n${error.toString()}`);
            }
        }
    } else {
        usedRecently.add(message.author.id);
        setTimeout(function () {
            usedRecently.delete(message.author.id);
        }, 300000);
    }

    try {
        return message.channel.send(`Friendly reminder that <@${bot.user.id}> is watching you.`, { file: "./img/bigBrother.png" });
    } catch (error) {
        errorLog(error);
        return message.channel.send(`Error:\n${error.toString()}`);
    }
}

module.exports.help = command;