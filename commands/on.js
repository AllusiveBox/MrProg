﻿/*
    Command Name: on.js
    Function: Allows the Owner and Temp Owner to turn on the Bot
    Clearance: Owner and Temp Owner Only.
	Default Enabled: Yes
    Date Created: 11/10/17
    Last Updated: 10/27/18
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
    bigDescription: ("Turns the Bot's status to online and sets the isOn flag to true.\n"
        + "Returns:\n\t"
        + "This command returns nothing"),
    description: "Sets the bot to online, responds to commands again",
    enabled: null,
    fullName: "On",
    name: "on",
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

    if (config.isOn) { // Ignore if the Bot is Already Accepting Commands
        await react(message, false);
        return message.channel.send(`Unable to turn the bot on when it's already on.`);
    }

    // Check if User is in the User ID List
    let validUser = false;
    Object.keys(userids).forEach(function (key) {
        if (userids[key] === message.author.id) { // If Member is in the User ID List...
            return validUser = true;
        }
    });

    if (validUser) {
        debug(`${message.author.username} is switching the bot to 'on' state.`);
        bot.user.setStatus("online").catch(error => {
            errorLog(error);
            message.author.send(`An unexpected error prevented me from updating my status...`
                + `Please try again in a few minutes.`);
            return react(message, false);
        });
        config.isOn = true;

        // React to Message
        react(message);
    }
}

module.exports.help = command;