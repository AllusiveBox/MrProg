/*
    Command Name: progsmash.js
    Function: Returns Prog Smash
    Clearance: none
	Default Enabled: Yes
    Date Created: 04/01/18
    Last Updated: 09/29/20
    Last Updated By: AllusiveBox

*/

// Load in Required Files
const Discord = require(`discord.js`);
const config = require(`../files/config.json`);
const { debug, error: errorLog } = require(`../functions/log.js`);
const { run: disabledCommand } = require(`../functions/disabledCommand.js`);

// Command Variables
const command = {
    bigDescription: ("Sends the Prog Smash gif.\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "PROG ANGRY. PROG SMASH!",
    enabled: true,
    fullName: "Prog Smash",
    name: "progsmash",
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
        disabledCommand(name, message);
    }

    return message.channel.send({
        files: [{
            attachment: "./img/magicslam.gif",
            name: "progSmash.gif"
        }]
    }).catch(error => {
        errorLog(error);
        message.channel.send(`Unexpected error caused by ${message.author} when using the ${command.fullName} command.`);
    });
}

module.exports.help = command;