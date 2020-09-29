/*
    Command Name:
    Function: 
    Clearance: none
	Default Enabled: Yes
    Date Created: 10/13/18
    Last Updated: 09/29/20
    Last Updated By: AllusiveBox

*/

// Load in Required Files
const Discord = require(`discord.js`);
const { run: hasElevatedPermissions } = require(`../functions/hasElevatedPermissions.js`);
const config = require(`../files/config.json`);
const userids = require(`../files/userids.json`);
const { debug, error: errorLog } = require(`../functions/log.js`);

// Command Variables
const command = {
    adminOnly: false,
    bigDescription: ("This command informs you of what the mistake was."
        + "Returns\n\t"
        + config.returnsChannel),
    description: "Oh, mistakes were made...",
    enabled: true, // true/false
    fullName: "Mistake",
    name: "mistake",
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

    if (await hasElevatedPermissions(bot, message, command.adminOnly, sql, true)) {
        return message.channel.send({
            files: [{
                attachment: "./img/mistake.png",
                name: "mistake.png"
            }]
        }).catch(error => {
            errorLog(error);
            return message.channel.send(errr.toString());
        });
    }
}

module.exports.help = command;