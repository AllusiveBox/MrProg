/*
    Command Name: faq.js
    Function: Provides a Link to the FAQ
    Clearance: none
	Default Enabled: Yes
    Date Created: 09/05/2020
    Last Updated: 09/05/2020
    Last Update By: AllusiveBox
*/

// Load in Required Files
const Discord = require(`discord.js`);
const config = require(`../files/config.json`);
const { debug } = require(`../functions/log.js`);
const { run: disabledCommand } = require(`../functions/disabledCommand.js`);

// Command Variables
const command = {
    adminOnly: false,
    bigDescription: ("This command provides a link to the Chrono X FAQ.\n"
        + "Returns:\n\t"
        + `${config.returnsChannel}`),
    description: "Provides a link to the Chrono X FAQ.",
    enabled: true,
    fullName: "FAQ",
    name: "faq",
    permissionLevel: "none"
};

/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string[]} args
 */
module.exports.run = async (bot, message, args) => {
    // Debug to Console
    debug(`I am inside the ${command.fullName} Command.`);

    // Enabled Command Test
    if (!command.enabled) {
        return disabledCommand(command.name, message);
    }

    return message.channel.send("For a list of Frequently Asked Questions, please check the following link:\n"
        + "http://cxfaqdoc.mmbnchronox.com/");
}

module.exports.help = command;