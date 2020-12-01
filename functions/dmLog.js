﻿/** 

    cxBot.js Mr. Prog DM Logging Script
    Version: 3
    Author: AllusiveBox
    Date Started: 11/17/18
    Date Last Updated: 11/24/20
    Last Updated By: AllusiveBox

**/

// Load in Required Files
const Discord = require(`discord.js`);
const channels = require(`../files/channels.json`);
const config = require(`../files/config.json`);
const userids = require(`../files/userids.json`);
const { debug, error: errorLog, dmLog } = require(`../functions/log.js`);

/**
 * 
 * @param {Discord.Client} bot
 * @param {Doscprd.Message} message
 */

module.exports.run = async (bot, message) => {
    // Debug to Console
    debug(`I am inside the DM Log System.`);

    if (message.author.id === userids.ownerID) return;

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
    let avatar = message.author.avatarURL();

    // Check if there are attachments
    let attachments;
    if (message.attachments.size > 0) { // If Attachments...
        message.attachments.forEach(function (attachment) {
            attachments = attachment;
        });
        console.log(attachments);
    }

    // Build the Embed

    let dmLogEmbed = new Discord.MessageEmbed()
        .setDescription(`Direct Message Received!`)
        .setColor(logChannelColor)
        .setThumbnail(avatar)
        .addField(`DM From:`, message.author.username)
        .addField(`User ID:`, message.author.id);

    if (message.content.length > 1024) {
        debug(`message.content.length exceeds 1024 characters. Total length is: ${message.content.length}`);
        dmLogEmbed
            .addField("Content (1/2)", message.content.substring(0, 1023))
            .addField("Content (2/2)", message.content.substring(1024, message.content.length));
    } else {
        dmLogEmbed.addField("Content", message.content);
    }

    dmLogEmbed
        .addField(`Attachments:`, message.attachments.size > 0 ? `Filename: ${attachments.filename}\n\tURL: ${attachments.proxyURL}` : `None`)
        .addField(`Time:`, new Date());

    try {
        bot.channels.cache.get(logID).send(dmLogEmbed);
    } catch (error) {
        errorLog(error);
        return bot.users.cache.get(userids.ownerID).send(`Error caused by ${message.author.username} in functions/dmLog\n*${error.toString}*`);
    }
}