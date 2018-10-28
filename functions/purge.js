/** 

    cxBot.js Mr. Prog Purge Scripts
    Version: 4
    Author: AllusiveBox
    Date Started: 10/07/18
    Date Last Updated: 10/27/18
    Last Updated By: AllusiveBox

**/

const Discord = require(`discord.js`);
const fs = require(`fs`);
const config = require(`../files/config.json`);
const channels = require(`../files/channels.json`);
const userids = require(`../files/userids.json`);
const { debug, error: errorLog } = require(`../functions/log.js`);
const { run: react } = require(`../functions/react.js`);

/**
 * 
 * @param {Discord.Collection} messages
 */

function recordMessages(messages) {
    let stream = fs.createWriteStream("purgedMessages.txt");

    let messageCount = 0;

    messages.forEach(function (message) {
        // Build the Message Content
        let content = `{\tMessage Posted in: ${message.channel.name}\n`;
        content = `${content}\tMessage Author: ${message.author.username}\n`;
        content = `${content}\tMessage Author ID: ${message.author.id}\n`;
        content = `${content}\tMessage Content: ${message.content}\n`;
        content = `${content}\tMessage ID: ${message.id}\n`;
        if (message.attachments) { // If Attachments
            message.attachments.forEach(function (attachment) {
                content = `${content}\tAttachment: ${attachment}\n`
            });
        }
        content = `${content}\tMessage Sent: ${new Date(message.createdTimestamp)}\n`;
        content = `${content}},\n`;
        stream.write(content.substring(0, content.length));
        messageCount++;
    });
    stream.end();

    return messageCount;
}

/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {int} amount
 * @param {Discord.GuildMember} [user=null]
 */

module.exports.run = async (bot, message, amount, user = null) => {
    // Debug to Console
    debug(`I am inside the Purge System.`);

    message.channel.fetchMessages({ limit: amount }).then((messages) => {

        messages = messages.filter(message => !message.deleted);

        if (user) {
            const filterBy = user ? user.id : bot.user.id;
            messages = messages.filter(message => message.author.id === filterBy).array().slice(0, amount);
        }

        let messageCount = recordMessages(messages);

        message.channel.bulkDelete(messages).catch(error => {
            errorLog(error);
            message.channel.send(error);
            return react(message, false);
        });

        // Load in Log Channel ID
        let logID = channels.log;

        if (!logID) { // If no Log ID...
            debug(`Unable to find log ID in channels.json. Looking for another log channel.`);

            // Look for Log Channel in Server
            logChannel = message.member.guild.channels.find(val => val.name === "log");
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
            bot.users.get(userids.ownerID).send(purgeEmbed);
        } else {
            bot.channels.get(logID).send(purgeEmbed).catch(error => {
                return errorLog(error);
            });
        }
    });
}