/*
    Command Name: google.js
    Function: Just google it, Lan...
    Clearance: none
	Default Enabled: Yes
    Date Created: 01/15/18
    Last Updated: 09/29/20
    Last Update By: AllusiveBox

*/

// Load in Required Files
const Discord = require(`discord.js`);
const config = require(`../files/config.json`);
const { debug, error: errorLog } = require(`../functions/log.js`);
const { run: disabledCommand } = require(`../functions/disabledCommand.js`);
const { check: dmCheck } = require(`../functions/dmCheck.js`);

// Command Variables
const command = {
    bigDescription: ("Just google it, Lan...\n"
        + "Returns:\n\t" + config.returnsChannel),
    description: "Google it",
    enabled: true,
    fullName: "Google",
    name: "google",
    permissionLevel: "normal"
}


/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string[]} args
 */
module.exports.run = async (bot, message, args) => {
    // Debug to Console
    debug(`I am inside the ${command.fullName} command.`);

    // Enabled Command Test
    if (!command.enabled) {
        return disabledCommand(command.name, message);
    }

    // DM Check
    if (await (!dmCheck(message, command.name))) {
        message.delete().catch(error => {
            errorLog(`Unable to purge command by ${message.author.username}.`);
        });
    } 

    return message.channel.send({
        files: [{
            attachment: "./img/google.png",
            name: "Let me Google that for you.png"
        }]
    });
}

module.exports.help = command;