/** 

    cxBot.js Mr. Prog Purge Scripts
    Version: 4
    Author: AllusiveBox
    Date Started: 10/07/18
    Date Last Updated: 11/26/18
    Last Updated By: Th3_M4j0r

**/

import * as Discord from 'discord.js';
import { createWriteStream } from 'fs';
import { debug, error as errorLog } from './log.js';
import { run as react } from './react.js';


import config = require('../files/config.json');
import channels = require('../files/channels.json');
import userIds = require('../files/userids.json');

/**
 * 
 * @param {Discord.Collection} messages
 */

function recordMessages(messages: Discord.Collection<any, Discord.Message>) {
    let stream = createWriteStream("purgedMessages.txt");

    let messageCount = 0;

    messages.forEach(function (message) {
        try {
            // Build the Message Content
            let content = `{\tMessage Posted in: ${(<Discord.TextChannel>message.channel).name}\n`;
            content = `${content}\tMessage Author: ${message.author.username}\n`;
            content = `${content}\tMessage Author ID: ${message.author.id}\n`;
            content = `${content}\tMessage Content: ${message.content}\n`;
            content = `${content}\tMessage ID: ${message.id}\n`;
            if (message.attachments) { // If Attachments
                message.attachments.forEach(function (attachment) {
                    content = `${content}\tAttachment: ${attachment.filename}\n`;
                    content = `${content}\t ${attachment.proxyURL}\n`;
                });
            }
            content = `${content}\tMessage Sent: ${new Date(message.createdTimestamp)}\n`;
            content = `${content}},\n`;
            stream.write(content.substring(0, content.length));
            messageCount++;
        } catch (error) {
            errorLog(error);
            message.channel.send(`Error in functions/purge.recordMessages\n*${error.toString}*`);
        }
    });
    stream.end();

    return messageCount;
}

/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {Number} amount
 * @param {Discord.GuildMember} [user=null]
 */

export async function run(bot: Discord.Client, message: Discord.Message, amount: number, user: Discord.GuildMember = null) {
    // Debug to Console
    debug(`I am inside the Purge System.`);

    message.channel.fetchMessages({ limit: amount }).then((messages) => {

//@ts-ignore
        messages = messages.filter(message => !message.deleted);

        if (user) {
            const filterBy = user ? user.id : bot.user.id;
//@ts-ignore
            messages = messages.filter(message => message.author.id === filterBy).array().slice(0, amount);
        }

        let messageCount = recordMessages(messages);

        try {
            message.channel.bulkDelete(messages);
        } catch (error) {
            errorLog(error);
            message.channel.send(`Error in functions/purge.js\n*${error.toString}*`);
            return react(message, false);
        }

        // Load in Log Channel ID
        let logID = channels.log;

        if (!logID) { // If no Log ID...
            debug(`Unable to find log ID in channels.json. Looking for another log channel.`);

            // Look for Log Channel in Server
            let logChannel = message.member.guild.channels.find(val => val.name === "log");
            if (!logChannel) { // If Unable to Find Log Channel...
                debug(`Unable to find any kind of log channel.`);
            } else {
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
            .addField("Number of Messages Deleted", messageCount)
            .addField("Purged On", new Date());

        react(message);

        // Check if there is an ID Now...
        if (!logID) { // If no Log ID...
            bot.users.get(userIds.ownerID).send(purgeEmbed);
        } else {
            (<Discord.TextChannel>bot.channels.get(logID)).send(purgeEmbed).catch(error => {
                return errorLog(error);
            });
        }
    });
}