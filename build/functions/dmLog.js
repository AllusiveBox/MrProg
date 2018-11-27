"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const log_js_1 = require("./log.js");
const channels = require("../files/channels.json");
const config = require("../files/config.json");
const userIds = require("../files/userids.json");
async function run(bot, message) {
    log_js_1.debug(`I am inside the DM Log System.`);
    if (message.author.id === userIds.ownerID)
        return;
    log_js_1.dmLog(message);
    let logChannelColor = config.logChannelColors.dmLog;
    let logID = channels.dmLog;
    if (!logID) {
        return log_js_1.debug(`Unable to find the dmLog ID in channels.json.`);
    }
    let avatar = message.author.avatarURL;
    let attachments;
    if (message.attachments.size > 0) {
        message.attachments.forEach(function (attachment) {
            attachments = attachment;
        });
        console.log(attachments);
    }
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
    }
    catch (error) {
        log_js_1.error(error);
        return bot.users.get(userIds.ownerID).send(`Error caused by ${message.author.username} in functions/dmLog\n*${error.toString}*`);
    }
}
exports.run = run;
