/*
    Command Name: oof.js
    Function: Returns an oof
    Clearance: none
	Default Enabled: Yes
    Date Created: 01/15/18
    Last Updated: 10/06/18
    Last Updated By: Th3_M4j0r

*/

// Load in Required Files
const Discord = require(`discord.js`);
const config = require(`../files/config.json`);
const { run: disabledCommand } = require(`../functions/disabledCommand.js`);
const { debug, error: errorLog } = require(`../functions/log.js`);

// Command Stuff
const command = {
    bigDescription: ("Sends a bigger oof!\n"
        + "Returns:\n\t" + config.returnsChannel),
    description: "Returns a big oof",
    enabled: true,
    fullName: "Big Oof!",
    name: "bigoof",
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
        return disabledCommand(command.name, message);
    }

    try {
        return message.channel.send({ file: "./img/bigoof.png" });
    } catch (error) {
        errorLog(error);
    }
}

module.exports.help = command;