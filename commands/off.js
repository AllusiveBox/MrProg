/*
    Command Name: off.js
    Function: Make the Bot stop Accepting Commands
    Clearance: Onwers only
	Default Enabled: Cannot be Disabled
    Date Created: 10/27/17
    Last Updated: 11/17/18
    Last Updated By: AllusiveBox

*/

// Load in Required Files
const Discord = require(`discord.js`);
const config = require(`../files/config.json`);
const userids = require(`../files/userids.json`);
const { debug, error: errorLog } = require(`../functions/log.js`);
const { run: react } = require(`../functions/react.js`);

// Command Stuff
const command = {
    bigDescription: ("Turns the Bot's status to invisible and sets the isOn flag to false.\n"
        + "Returns:\n\t"
        + "This command returns nothing"),
    description: "Sets the bot to invisible, ignores commands from most users",
    enabled: null,
    fullName: "Off",
    name: "off",
    permissionLevel: "owner"
}


/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 */

module.exports.run = async (bot, message) => {
    // Debug to Console
    debug(`I am inside the ${command.fullName} command.`);

    if (!config.isOn) { // Ignore if the Bot is Already Rejecting Commands
        await react(message, false);
        return message.channel.send(`Unable to turn the bot off when it's already off.`);
    }

    // Check if User is in the User ID List
    let validUser = false;
    Object.keys(userids).forEach(function (key) {
        if (userids[key] === message.author.id) { // If Member is in the User ID List...
            return validUser = true;
        }
    });

    if (validUser) {
        debug(`${message.author.username} is switching the bot to 'off' state.`);
        bot.user.setStatus("invisible").catch(error => {
            errorLog(error);
            message.author.send(`An unexpected error prevented me from updating my status...Please try again in a few minutes.`);
            return react(message, false);
        });
        config.isOn = false;

        // React to Message
        return react(message);
    }
}

/**
 * 
 * @param {Discord.Client} bot
 */

module.exports.silent = async (bot) => {
    if (!config.isOn) { // Ignore if the Bot is Already Rejecting Commands...
        return console.log(`Unable to turn the bot off when it's already off.`);
    }

    try {
        bot.user.setStatus("invisible");
    } catch (error) {
        return errorLog(error);
    }

    config.isOn = false;
}

module.exports.help = command;