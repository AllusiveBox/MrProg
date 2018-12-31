/*
    Command Name: welcome.js
    Function: Gives the member a Welcome Message
    Clearance: none
	Default Enabled: Yes
    Date Created: 12/31/18
    Last Updated: 12/31/18
    Last Updated By: AllusiveBox

*/

// Load in Required Files
const Discord = require(`discord.js`);
const config = require(`../files/config.json`);
const { run: disabledCommand } = require(`../functions/disabledCommand.js`); 
const { run: disabledDMs } = require(`../functions/disabledDMs.js`);
const { run: dmCheck } = require(`../functions/dmCheck.js`);
const { debug, error: errorLog } = require(`../functions/log.js`);
const { run: welcomeMessage } = require(`../functions/welcomeMessage.js`);

// Command Variables
const command = {
    bigDescription: ("Sends the user a copy of the welcome message that is normally sent when a member joins the server.\n"
        + "Returns:\n\t"
        + config.returnsDM),
    description: "Sends a welcome message to the user.",
    enabled: true, 
    fullName: "Welcome",
    name: "welcome",
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

    // DM Check
    if (await dmCheck(message, command.fullName)) return; // Return on DM channel

    let reply = welcomeMessage(message.member);

    try {
        await message.author.send(reply);
        return debug(`Welcome message successfully sent to ${message.author.username}.`);
    } catch (error) {
        if (error.toString().includes("Cannot send messages to this user")) {
            let reply = `I am sorry, ${message.author}, I am unable to DM you.\n`
                + `Please check your privacy settings and try again.`
            return disabledDMs(message, reply);
        } else {
            errorLog(error);
            return message.channel.send(error.toString());
        }
    }
}

module.exports.help = command;