/**

    cxBot.js Mr. Prog Functions to Handle Changed Messages
    Version: 1
    Author: AllusiveBox
    Date Created: 12/30/18
    Date Last Updated: 09/29/20
    Last Update By: AllusiveBox

**/

// Load in Required Files
const Discord = require(`discord.js`);
const config = require(`../files/config.json`);
const channels = require(`../files/channels.json`);
const {debug, error: errorLog } = require(`../functions/log.js`);

/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} oldMessage
 * @param {Discord.Message} newMessage
 */

module.exports.messageUpdate = async (bot, oldMessage, newMessage) => {
    debug(`In the messageUpdate Function.`);

    // Make sure Content Exists...
    if ((oldMessage.attachments.size === 0) &&
       ((oldMessage.content === null) || (newMessage.content === null) ||
        (oldMessage.content === undefined) || (newMessage.content === undefined) ||
        (oldMessage.content === "") || (newMessage.content === ""))) {
        return debug("No message detected...");
    }

    if (oldMessage.content === newMessage.content) {
        return debug("Message content is the same.");
    }

    // Load in Log Channel ID
    let logID = channels.messageLog;

    if (!logID) { // If no Log ID...
        debug("Unable to find log ID in channels.json. Looking for another log channel.");

        // Look for Log Cannel in Server
        let logChannel = oldMessage.guild.channels.cache.find(val => val.name === "log");
        if (!logChannel) { // If Unable to Find Log Channel...
            return debug("Unable to find any king of log channel.");
        } else {
            debug(`Setting logID to: ${logChannel.id}`);
            logID = logChannel.id;
        }
    }

    // Load in Embed Message Color
    let logChannelColor = config.logChannelColors.messageUpdated;

    // Grab the User Information
    let avatar = oldMessage.author.avatarURL;

    // Build the Embed

    let updateMessageEmbed = new Discord.MessageEmbed()
        .setDescription("Message Updated!")
        .setColor(logChannelColor)
        .setAuthor(oldMessage.author.username, avatar);

    if (oldMessage.content.length > 1024) { // If Old Message is Over 1024 Characters...
        updateMessageEmbed.addField("Original Message (1/2)", oldMessage.content.substring(0, 1023));
        updateMessageEmbed.addField("Original Message (2/2)", oldMessage.content.substring(1024, oldMessage.content.length));
    } else { // If Old Message is Under 1024 Characters...
        updateMessageEmbed.addField("Original Message", oldMessage.content || "[NO CONTENT]");
    }

    if (newMessage.content.length > 1024) { // If New Message is Over 1024 Characters...
        updateMessageEmbed.addField("Updated Message (1/2)", newMessage.content.substring(0, 1023));
        updateMessageEmbed.addField("Updated Message (2/2)", newMessage.content.substring(1024, oldMessage.content.length));
    } else { // If New Message is Under 1024 Characters...
        updateMessageEmbed.addField("Updated Message", newMessage.content || "[NO CONTENT]");
    }

    if (oldMessage.attachments.size > 0) { // If Attachments...
        oldMessage.attachments.forEach(function (attachment) {
            updateMessageEmbed.addField("Attachment Name", attachment.filename, true);
            updateMessageEmbed.addField("Attachment URL", attachment.proxyURL, true);
        });
    }

    // Set the Message Channel and gives the Message Context
    updateMessageEmbed.addField("Channel", `#${oldMessage.channel.name} - [Context](${newMessage.url})`);

    // Set the Update Time
    updateMessageEmbed.addField("Updated On", new Date());

    try {
        bot.channels.cache.get(logID).send(updateMessageEmbed);
    } catch (error) {
        errorLog(error);
    }

    return;
}

/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} deletedMessage
 */
module.exports.messageDelete = async (bot, deletedMessage) => {
    debug("In the messageDelete Function.");

    // Make sure Content Exists...
    if ((deletedMessage.attachments.size === 0) &&
        ((deletedMessage.content === null) || (deletedMessage.content === undefined) ||
            (deletedMessage.content === ""))) {
        return debug("No message detected...");
    }

    // Load in Log Channel ID
    let logID = channels.messageLog;

    if (!logID) { // If no Log ID...
        debug("Unable to find log ID in channels.json. Looking for another log channel.");

        // Look for Log Channel in Server
        let logChannel = deletedMessage.guild.channels.cache.find(val => val.name === "log");
        if (!logChannel) {// If Unable to Find Log Channel...
            debug("Unable to find any kind of log channel.");
        } else {
            logID = logChannel.id;
        }
    }

    // Load in Embed Message Color
    let logChannelColor = config.logChannelColors.messageDeleted;

    // Grab the User Avatar
    let avatar = deletedMessage.author.avatarURL;

    // Build the Embed
    let deletedMessageEmbed = new Discord.MessageEmbed()
        .setDescription("Message Deleted!")
        .setColor(logChannelColor)
        .setAuthor(deletedMessage.author.username, avatar);

    if (deletedMessage.content.length > 1024) { // If Deleted Message is Over 1024 Characters...
        deletedMessageEmbed.addField("Deleted Message (1/2)", deletedMessage.content.substring(0, 1023));
        deletedMessageEmbed.addField("Deleted Message (2/2)", deletedMessage.content.substring(1024, deletedMessage.content.length));
    } else { // If Deleted Message is Under 1024 Characters...
        deletedMessageEmbed.addField("Deleted Message", deletedMessage.content || "[NO CONTENT]");
    }

    if (deletedMessage.attachments.size > 0) { // If Attachents...
        deletedMessage.attachments.forEach(function (attachment) {
            deletedMessageEmbed.addField("Attachment Name", attachment.filename, true);
            deletedMessageEmbed.addField("Attment URL", attachment.proxyURL, true);
        });
    }

    // Set the Message Channel
    deletedMessageEmbed.addField("Channel", deletedMessage.channel.name);

    // Set the Update Time
    deletedMessageEmbed.addField("Updated On", new Date());

    try {
        bot.channels.cache.get(logID).send(deletedMessageEmbed);
    } catch (error) {
        errorLog(error);
    }

    return;
}
