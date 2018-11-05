/*
    Command Name: disable.js
    Function: To disable a command
    Clearance: mod+
	Default Enabled: Cannot be Disabled
    Date Created: 10/19/17
    Last Updated: 10/27/18
    Last Update By: AllusiveBox

*/

// Load in Require Files
const Discord = require(`discord.js`);
const config = require(`../files/config.json`);
const { run: hasElevatedPermissions } = require(`../functions/hasElevatedPermissions.js`);
const { debug, error: errorLog } = require(`../functions/log.js`);
const { run: react } = require(`../functions/react.js`);

// Command Variables
const command = {
    adminOnly: false,
    bigDescription: ("This command allows an administrator to disable a command for any reason.\n"
        + "Returns:\n\t"
        + "This command returns nothing."),
    description: "Disables a command.",
    enabled: null,
    fullName: "Disable",
    name: "disable",
    permissionLevel: "mod"
}

/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string[]} args
 * @param {sqlite} sql
 */
module.exports.run = async (bot, message, args, sql) => {
    // Debug to Console
    debug(`I am inside the ${command.fullName} command.`);

    if (args[0] === undefined) return debug(`No arguments passed.`)

    if (! await hasElevatedPermissions(bot, message, command.adminOnly, sql)) return;
    let toDisable = args[0].toLocaleLowerCase();
    if(! toDisable) { //no argument passed
        return debug(`No arguments passed`);
    }
    if (toDisable == "music") { //music is a special case
        toDisable == "play";
    }
    try {
        var enabled = bot.commands.get(toDisable).help.enabled;
    } catch (error) {
        errorLog(error);
        await react(message, false);
        return message.channel.send(`*${error.toString()}*`);
    }
    if (enabled === null) return debug(`This command cannot be disabled.`);
    debug(`Setting ${toDisable} to false.`);
    try {
        bot.commands.get(toDisable).help.enabled = false
    } catch (error) {
        errorLog(error);
        await react(message, false);
        return message.channel.send(`*${error.toString()}*`);
    }

    return react(message);
}

module.exports.help = command;
