/** 

    cxBot.js Mr. Prog DM Logging Script
    Version: 3
    Author: AllusiveBox
    Date Started: 11/17/18
    Date Last Updated: 11/17/18
    Last Updated By: AllusiveBox

**/

// Load in Required Files
import * as Discord from 'discord.js';
import { debug, error as errorLog, dmLog } from './log.js';


import channels = require('../files/channels.json');
import config = require('../files/config.json');
import userIds = require('../files/userids.json');

/**
 * 
 * @param {Discord.Client} bot
 * @param {Doscprd.Message} message
 */
export async function run(bot, message) {
    // Debug to Console
    debug(`I am inside the DM Log System.`);

    if (message.author.id === userIds.ownerID) return;

    // DM Logger
    dmLog(message);

    // Grab Log Channel Color
    let logChannelColor = config.logChannelColors.dmLog;

    // Load in the dmLog Channel ID
    let logID = channels.dmLog;

    // Check if there was an ID Provided...
    if (!logID) { // If no Log ID...
        return debug(`Unable to find the dmLog ID in channels.json.`);
    }

    // Get Avatar
    let avatar = message.author.avatarURL;

    // Check if there are attachments
    let attachments;
    if (message.attachments.size > 0) { // If Attachments...
        message.attachments.forEach(function (attachment) {
            attachments = attachment;
        });
        console.log(attachments);
    }

    // Build the Embed

    let dmLogEmbed = new Discord.RichEmbed()
        .setDescription(`Direct Message Received!`)
        .setColor(logChannelColor)
        .setThumbnail(avatar)
        .addField(`DM From:`, message.author.username)
        .addField(`User ID:`, message.author.id)
        .addField(`Content:`, message.content ? message.content : "None")
        .addField(`Attachments:`, message.attachments.size > 0 ? `Filename: ${attachments.filename}\n\tURL: ${attachments.proxyURL}` : `None`)
        .addField(`Time:`, new Date());

    try {
        bot.channels.get(logID).send(dmLogEmbed);
    } catch (error) {
        errorLog(error);
        return bot.users.get(userIds.ownerID).send(`Error caused by ${message.author.username} in functions/dmLog\n*${error.toString}*`);
    }
}