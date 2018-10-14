"use strict";
/**

    cxBot.js Mr. Prog Purge Scripts
    Version: 4
    Author: AllusiveBox
    Date Started: 10/07/18
    Date Last Updated: 10/10/18
    Last Updated By: Th3_M4j0r
**/
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const fs_1 = require("fs");
const log_js_1 = require("./log.js");
const config = require("../files/config.json");
const channels = require("../files/channels.json");
const userids = require("../files/userids.json");
/**
 *
 * @param {Discord.Message[]} messages
 */
function recordMessages(messages) {
    let stream = fs_1.createWriteStream("purgedMessages.txt");
    messages.forEach(function (message) {
        // Build the Message Content
        let channel = message.channel; //indicate that it is a text channel to typescript
        let content = `{\tMessage Posted in: ${channel.name}\n`;
        content = `${content}\tMessage Author: ${message.author.username}\n`;
        content = `${content}\tMessage Author ID: ${message.author.id}\n`;
        content = `${content}\tMessage Content: ${message.content}\n`;
        content = `${content}\tMessage ID: ${message.id}\n`;
        if (message.attachments) { // If Attachments
            message.attachments.forEach(function (attachment) {
                content = `${content}\tAttachment: ${attachment}\n`;
            });
        }
        content = `${content}\tMessage Sent: ${new Date(message.createdTimestamp)}\n`;
        content = `${content}},\n`;
        stream.write(content.substring(0, content.length));
    });
    stream.end();
}
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {number} amount
 * @param {?Discord.GuildMember} [user=null]
 */
async function run(bot, message, amount, user = null) {
    // Debug to Console
    log_js_1.debug(`I am inside the Purge System.`);
    let messages = (await message.channel.fetchMessages({ limit: amount })).array();
    //@ts-ignore message.deleted does exist, ts is erroring
    messages = messages.filter(message => !message.deleted);
    if (user) {
        const filterBy = user ? user.id : bot.user.id;
        messages = messages.filter(message => message.author.id === filterBy).slice(0, amount);
    }
    recordMessages(messages);
    message.channel.bulkDelete(messages).catch(error => {
        log_js_1.error(error);
        return message.channel.send(error);
    });
    // Load in Log Channel ID
    let logID = channels.log;
    if (!logID) { // If no Log ID...
        log_js_1.debug(`Unable to find log ID in channels.json. Looking for another log channel.`);
        // Look for Log Channel in Server
        let logChannel = message.member.guild.channels.find(val => val.name === "log");
        if (!logChannel) { // If Unable to Find Log Channel...
            log_js_1.debug(`Unable to find any kind of log channel.`);
        }
        else {
            logID = logChannel.id;
        }
    }
    // Get the Log Channel Color
    let logChannelColor = config.logChannelColors.messagesPurged;
    // Build the Embed
    let purgeEmbed = new Discord.RichEmbed()
        .attachFile({ attachment: "purgedMessages.txt", name: "purgedMessages.txt" })
        .setDescription("Messages Purged!")
        .setColor(logChannelColor)
        .addField("Targeted Purge", user === null ? "N/A" : user)
        .addField("Number of Messages Deleted", amount)
        .addField("Purged On", new Date());
    // Check if there is an ID Now...
    if (!logID) { // If no Log ID...
        bot.users.get(userids.ownerID).send(purgeEmbed);
    }
    else {
        let Channel = bot.channels.get(logID);
        Channel.send(purgeEmbed).catch(error => {
            log_js_1.error(error);
        });
    }
}
exports.run = run;
