"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const fs_1 = require("fs");
const log_js_1 = require("./log.js");
const react_js_1 = require("./react.js");
const config = require("../files/config.json");
const channels = require("../files/channels.json");
const userIds = require("../files/userids.json");
function recordMessages(messages) {
    let stream = fs_1.createWriteStream("purgedMessages.txt");
    let messageCount = 0;
    messages.forEach(function (message) {
        try {
            let content = `{\tMessage Posted in: ${message.channel.name}\n`;
            content = `${content}\tMessage Author: ${message.author.username}\n`;
            content = `${content}\tMessage Author ID: ${message.author.id}\n`;
            content = `${content}\tMessage Content: ${message.content}\n`;
            content = `${content}\tMessage ID: ${message.id}\n`;
            if (message.attachments) {
                message.attachments.forEach(function (attachment) {
                    content = `${content}\tAttachment: ${attachment.filename}\n`;
                    content = `${content}\t ${attachment.proxyURL}\n`;
                });
            }
            content = `${content}\tMessage Sent: ${new Date(message.createdTimestamp)}\n`;
            content = `${content}},\n`;
            stream.write(content.substring(0, content.length));
            messageCount++;
        }
        catch (error) {
            log_js_1.error(error);
            message.channel.send(`Error in functions/purge.recordMessages\n*${error.toString}*`);
        }
    });
    stream.end();
    return messageCount;
}
async function run(bot, message, amount, user = null) {
    log_js_1.debug(`I am inside the Purge System.`);
    message.channel.fetchMessages({ limit: amount }).then((messages) => {
        messages = messages.filter(message => !message.deleted);
        if (user) {
            const filterBy = user ? user.id : bot.user.id;
            messages = messages.filter(message => message.author.id === filterBy).array().slice(0, amount);
        }
        let messageCount = recordMessages(messages);
        try {
            message.channel.bulkDelete(messages);
        }
        catch (error) {
            log_js_1.error(error);
            message.channel.send(`Error in functions/purge.js\n*${error.toString}*`);
            return react_js_1.run(message, false);
        }
        let logID = channels.log;
        if (!logID) {
            log_js_1.debug(`Unable to find log ID in channels.json. Looking for another log channel.`);
            let logChannel = message.member.guild.channels.find(val => val.name === "log");
            if (!logChannel) {
                log_js_1.debug(`Unable to find any kind of log channel.`);
            }
            else {
                logID = logChannel.id;
            }
        }
        let logChannelColor = config.logChannelColors.messagesPurged;
        let purgeEmbed = new Discord.RichEmbed()
            .attachFile({ attachment: "purgedMessages.txt", name: "purgedMessages.txt" })
            .setDescription("Messages Purged!")
            .setColor(logChannelColor)
            .addField("Targeted Purge", user === null ? "N/A" : user)
            .addField("Number of Messages Deleted", messageCount)
            .addField("Purged On", new Date());
        react_js_1.run(message);
        if (!logID) {
            bot.users.get(userIds.ownerID).send(purgeEmbed);
        }
        else {
            bot.channels.get(logID).send(purgeEmbed).catch(error => {
                return log_js_1.error(error);
            });
        }
    });
}
exports.run = run;
