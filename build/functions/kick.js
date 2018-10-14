"use strict";
/**

    cxBot.js Mr. Prog Kick Scripts
    Version: 4
    Author: AllusiveBox
    Date Created: 08/08/18
    Date Last Updated: 10/13/18
    Last Update By: AllusiveBox

**/
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const log_js_1 = require("./log.js");
const config = require("../files/config.json");
const channels = require("../files/channels.json");
const userids = require("../files/userids.json");
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {Discord.GuildMember} member
 * @param {string} reason
 * @param {betterSql} sql
 */
async function run(bot, message, member, reason, sql) {
    // Debug to Console
    log_js_1.debug(`I am inside the kick function.`);
    let logchannelColor = config.logChannelColors.memberKick;
    // Load in the Log Channel ID
    let logID = channels.log;
    // Check if there was an ID Provided
    if (!logID) { // If no Log ID...
        log_js_1.debug(`Unable to find the log ID in channels.json.`
            + `Looking for another log channel.`);
        // Look for Log Channel in Server
        let logChannel = message.member.guild.channels.find(val => val.name === "log");
        if (!logChannel) { // If Unable to Find Log Channel...
            log_js_1.debug(`Unable to find any kind of log channel.`);
        }
        else {
            logID = logChannel.id;
        }
    }
    // Get Avatar
    let avatar = member.user.avatarURL;
    // Build the Embed
    let kickedEmbed = new Discord.RichEmbed()
        .setDescription(`Member Kicked!`)
        .setColor(logchannelColor)
        .setThumbnail(avatar)
        .addField("Member Name", member.user.username)
        .addField("Member ID", member.user.id)
        .addField("Kicked On", new Date())
        .addField("Reason", reason);
    // Check if there is an ID Now
    if (!logID) { // If no Log ID...
        bot.users.get(userids.ownerID).send(kickedEmbed);
    }
    else {
        let Channel = bot.channels.get(logID);
        Channel.send(kickedEmbed);
    }
    log_js_1.debug(`Kicking ${member.user.username} from ${message.member.guild.name} `
        + `for ${reason}.`);
    await member.kick(reason).catch(error => {
        log_js_1.error(error);
        return message.channel.send(`Sorry, ${message.author}, I could not kick `
            + `${member.user.username} because of ${error}.`);
    });
    // Set isKicking flag to false
    return log_js_1.debug(`Kick Successful.`);
}
exports.run = run;
