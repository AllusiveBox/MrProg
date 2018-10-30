"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const log_js_1 = require("../functions/log.js");
const welcomeMessage_js_1 = require("../functions/welcomeMessage.js");
const channels = require("../files/channels.json");
const config = require("../files/config.json");
const userIds = require("../files/userids.json");
async function run(bot, member) {
    log_js_1.debug(`I am inside the memberLeave Function.`);
    let logchannelColor = config.logChannelColors.memberJoin;
    let logID = channels.log;
    if (!logID) {
        log_js_1.debug(`Unable to find the log ID in channels.json.`
            + `Looking for another log channel.`);
        let logChannel = member.guild.channels.find(val => val.name === 'log');
        if (!logChannel) {
            log_js_1.debug(`Unable to find any kind of log channel.`);
        }
        else {
            logID = logChannel.id;
        }
    }
    let message = welcomeMessage_js_1.run(member);
    var sentDM = true;
    await member.send(message).catch(error => {
        log_js_1.error(error);
        sentDM = false;
        log_js_1.debug(`Unable to DM user, setting sentDM to ${sentDM}.`);
    });
    let avatar = member.user.avatarURL;
    let joinEmbed = new Discord.RichEmbed()
        .setDescription(`Member Joined!`)
        .setColor(logchannelColor)
        .setThumbnail(avatar)
        .addField("Member Name", member.user.username)
        .addField("Member ID", member.user.id)
        .addField("Account Created", member.user.createdAt)
        .addField("Joined On", member.joinedAt)
        .addField("DM Successfully Sent", sentDM);
    if (!logID) {
        bot.users.get(userIds.ownerID).send(joinEmbed);
    }
    else {
        let logChannel = bot.channels.get(logID);
        logChannel.send(joinEmbed);
    }
}
exports.run = run;
