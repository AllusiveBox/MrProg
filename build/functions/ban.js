"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const log_js_1 = require("./log.js");
const config = require("../files/config.json");
const userids = require("../files/userids.json");
const channels = require("../files/channels.json");
async function run(bot, message, member, reason, sql) {
    log_js_1.debug(`I am inside the ban function.`);
    let logchannelColor = config.logChannelColors.memberBan;
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
    log_js_1.debug(`Banning ${member.user.username} from ${message.member.guild.name} `
        + `for ${reason}.`);
    try {
        await member.ban(reason);
    }
    catch (error) {
        log_js_1.error(error);
        await message.react(config.fail);
        return message.channel.send(`Sorry, ${message.author}, I could not ban `
            + `${member.user.username} because of ${error}.`);
    }
    let avatar = member.user.avatarURL;
    let bannedEmbed = new Discord.RichEmbed()
        .setDescription(`Member Banned!`)
        .setColor(logchannelColor)
        .setThumbnail(avatar)
        .addField("Member Name", member.user.username)
        .addField("Member ID", member.user.id)
        .addField("Banned On", new Date())
        .addField("Reason", reason);
    if (!logID) {
        bot.users.get(userids.ownerID).send(bannedEmbed);
    }
    else {
        let Channel = bot.channels.get(logID);
        Channel.send(bannedEmbed);
    }
    await message.react(config.success);
    return log_js_1.debug(`Ban Successful.`);
}
exports.run = run;
