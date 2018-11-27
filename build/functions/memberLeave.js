"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const deleteMemberInfo_js_1 = require("./deleteMemberInfo.js");
const log_js_1 = require("./log.js");
const channels = require("../files/channels.json");
const config = require("../files/config.json");
const userids = require("../files/userids.json");
async function run(bot, member, sql) {
    log_js_1.debug(`I am inside the memberLeave Function.`);
    let logchannelColor = config.logChannelColors.memberLeave;
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
    let avatar = member.user.avatarURL;
    let joinDate = await sql.getJoinDate(member.user.id);
    let leaveEmbed = new Discord.RichEmbed()
        .setDescription(`Member Left`)
        .setColor(logchannelColor)
        .setThumbnail(avatar)
        .addField("Member Name", member.user.username)
        .addField("Member ID", member.user.id)
        .addField("Account Created", member.user.createdAt)
        .addField("Joined On", new Date(joinDate))
        .addField("Left On", new Date());
    if (!logID) {
        bot.users.get(userids.ownerID).send(leaveEmbed);
    }
    else {
        let Channel = bot.channels.get(logID);
        Channel.send(leaveEmbed);
    }
    deleteMemberInfo_js_1.run(bot, member, sql);
}
exports.run = run;
