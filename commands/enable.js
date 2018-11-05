/*
    Command Name: disable.js
    Function: To disable a command
    Clearance: mod+
	Default Enabled: Cannot be Disabled
    Date Created: 10/17/17
    Last Updated: 10/27/18
    Last Update By: AllusiveBox

*/

// Load in Require Files
const Discord = require(`discord.js`);
const config = require(`../files/config.json`);
const { debug, error: errorLog } = require(`../functions/log.js`);
const { run: hasElevatedPermissions } = require(`../functions/hasElevatedPermissions.js`);
const { run: react } = require(`../functions/react.js`);

// Command Variables
const command = {
    adminOnly: false,
    bigDescription: ("This command allows an administrator to enable a command that is disabled.\n"
        + "Returns:\n\t"
        + "This command returns nothing."),
    description: "Enables a command.",
    enabled: null,
    fullName: "Enable",
    name: "enable",
    permissionLevel: "mod"
}

/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string[]} [args]
 * @param {sqlite} sql
 */
module.exports.run = async (bot, message, args, sql) => {
    // Debug to Console
    debug(`I am inside the ${command.fullName} command.`);

    if (args[0] === undefined) return debug(`No arguments passed.`)

    if (! await hasElevatedPermissions(bot, message, command.adminOnly, sql)) return;
    let toEnable = args[0].toLocaleLowerCase();
    if(! toEnable) { //no argument passed
        return debug(`No arguments passed`);
    }
    if (toEnable == "music") { //music is a special case
        toEnable = "play";
    }
    try {
        var enabled = bot.commands.get(toEnable).help.enabled;
    } catch (error) {
        errorLog(error);
        await react(message, false);
        return message.channel.send(`*${error.toString()}*`);
    }
    if (enabled === null) return debug(`This command cannot be disabled.`);
    debug(`Setting ${toEnable} to true.`);
    try {
        bot.commands.get(toEnable).help.enabled = true;
    } catch (error) {
        errorLog(error);
        await react(message, false);
        return message.channel.send(`*${error.toString()}*`);
    }

    return react(message);
}

module.exports.help = command;
