/*
    Command Name: !newupdate
    Function: CX is now on the 3ds!
    Clearance: none
    Default Enabled: Yes
    Date Created: 03/31/19
    Last Updated: 03/31/19
    Last Update By: Th3_M4j0r

*/

// Load in Required Files
const Discord = require(`discord.js`);
const config = require(`../files/config.json`);
const { debug, error: errorLog } = require(`../functions/log.js`);
const { run: disabledCommand } = require(`../functions/disabledCommand.js`);

// Command Variables
const command = {
    bigDescription: ("Bot tells you about the new update\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "newUpdate!",
    enabled: true,
    fullName: "newUpdate",
    name: "newupdate",
    permissionLevel: "normal"
};


/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string[]} [args]
 */
module.exports.run = async (bot, message, args) => {
    // Debug to Console
    debug(`I am in the ${command.fullName} command.`);

    // Enabled Command Test
    if (!command.enabled) {
        return disabledCommand(command.name, message);
    }

    return message.channel.send("https://www.youtube.com/watch?v=wga_WKqDIw4\n"
        + "Chrono X is now on the 3DS! With Killer Howard saying \"it just works!\" over and over again, "
        + "the game now has the ability to be played on more platforms."
    );
};

module.exports.help = command;
