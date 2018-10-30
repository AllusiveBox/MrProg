"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const log_js_1 = require("./log.js");
const config = require("../files/config.json");
const channels = require("../files/channels.json");
const userids = require("../files/userids.json");
async function run(bot, message, member, reason, sql) {
    log_js_1.debug(`I am inside the kick function.`);
    let logchannelColor = config.logChannelColors.memberKick;
    let logID = channels.log;
    if (!logID) {
        log_js_1.debug(`Unable to find the log ID in channels.json.`
            + `Looking for another log channel.`);
        let logChannel = message.member.guild.channels.find(val => val.name === "log");
        if (!logChannel) {
            log_js_1.debug(`Unable to find any kind of log channel.`);
        }
        else {
            logID = logChannel.id;
        }
    }
    let avatar = member.user.avatarURL;
    let kickedEmbed = new Discord.RichEmbed()
        .setDescription(`Member Kicked!`)
        .setColor(logchannelColor)
        .setThumbnail(avatar)
        .addField("Member Name", member.user.username)
        .addField("Member ID", member.user.id)
        .addField("Kicked On", new Date())
        .addField("Reason", reason);
    if (!logID) {
        bot.users.get(userids.ownerID).send(kickedEmbed);
    }
    else {
        let Channel = bot.channels.get(logID);
        Channel.send(kickedEmbed);
    }
    log_js_1.debug(`Kicking ${member.user.username} from ${message.member.guild.name} `
        + `for ${reason}.`);
    try {
        await member.kick(reason);
    }
    catch (error) {
        log_js_1.error(error);
        return message.channel.send(`Sorry, ${message.author}, I could not kick `
            + `${member.user.username} because of ${error}.`);
    }
    sql.deleteUser(member.id);
    return log_js_1.debug(`Kick Successful.`);
}
exports.run = run;
