﻿/*
    Command Name: off.js
    Function: Make the Bot stop Accepting Commands
    Clearance: Onwers only
	Default Enabled: Cannot be Disabled
    Date Created: 10/27/17
    Last Updated: 11/17/18
    Last Updated By: AllusiveBox

*/

// Load in Required Files
import * as Discord from 'discord.js';
import { debug, error as errorLog, commandHelp } from '../functions/log.js';
import { run as react } from '../functions/react.js';


import config = require('../files/config.json');
import userids = require('../files/userids.json');

// Command Stuff
const command: commandHelp = {
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

export async function run(bot: Discord.Client, message: Discord.Message) {
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
 export async function silent(bot: Discord.Client) {
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

export const help = command;
