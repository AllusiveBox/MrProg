/*
    Command Name: wikiresources.js
    Function: DMs recommended urls from the Chrono X wiki
    Clearance: none
	Default Enabled: Yes
    Date Created: 01/05/19
    Last Updated: 01/05/19
    Last Update By: DeCoded_Void
*/

// Load in Required Files
const Discord = require(`discord.js`);
const config = require(`../files/config.json`);
const { debug } = require(`../functions/log.js`);
const { run: disabledCommand } = require(`../functions/disabledCommand.js`);
const { run: disabledDMs } = require(`../functions/disabledDMs`);
const { run: react } = require(`../functions/react.js`);

// Command Stuff
const command = {
    bigDescription: ("DMs the Standard Chips, Chip Trader, and Upgrade pages from the mmbnchronox wikia.\n"
        + "Returns:\n\t" + config.returnsChannel),
    description: "DMs recommended wiki articles to help you get started!",
    enabled: true,
    fullName: "Wiki Resources",
    name: "wikiresources",
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

    // Build Reply
    debug(`Generating the Wiki Resources reply for ${message.author.username}`);
    let reply = (`Here is a list of recommended wiki articles to help you obtain chips and upgrades for netbattling:\n`
        + "**Standard Chips**: <http://mmbnchronox.wikia.com/wiki/List_of_Standard_Chips> \n"
        + "**Chip Trader**: <http://mmbnchronox.wikia.com/wiki/Chip_Trader> \n"
        + "**Upgrades List**: <http://mmbnchronox.wikia.com/wiki/Upgrade> \n");
	
    // Send the Message
    await react(message);
    return message.author.send(reply).catch(error => {
        return disabledDMs(message, reply);
    });
}

module.exports.help = command;
