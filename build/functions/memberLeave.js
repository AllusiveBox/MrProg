"use strict";
/**

    cxBot.js Mr. Prog Member Leaving Scripts
    Version: 4
    Author: AllusiveBox
    Date Started: 08/09/18
    Date Last Updated: 10/10/18
    Last Update By: Th3_M4j0r

**/
Object.defineProperty(exports, "__esModule", { value: true });
// Load in Required Libraries and Files
const Discord = require("discord.js");
const deleteMemberInfo_js_1 = require("./deleteMemberInfo.js");
const log_js_1 = require("./log.js");
const channels = require("../files/channels.json");
const config = require("../files/config.json");
const userids = require("../files/userids.json");
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.GuildMember} member
 * @param {betterSql} sql
 *
 * @returns {Promise<void>}
 */
async function run(bot, member, sql) {
    // Debug to Console
    log_js_1.debug(`I am inside the memberLeave Function.`);
    // Get Log Channel Color
    let logchannelColor = config.logChannelColors.memberLeave;
    // Load in the Log Channel ID
    let logID = channels.log;
    // Check if there was an ID Provided
    if (!logID) { // If no Log ID...
        log_js_1.debug(`Unable to find the log ID in channels.json.`
            + `Looking for another log channel.`);
        // Look for Log Channel in the Server
        let logChannel = member.guild.channels.find(val => val.name === 'log'); //changed to function, since other way is deprecated
        if (!logChannel) {
            log_js_1.debug(`Unable to find any kind of log channel.`);
        }
        else {
            logID = logChannel.id;
        }
    }
    // Get the Member's Avatar
    let avatar = member.user.avatarURL;
    // Build the Embed
    let leaveEmbed = new Discord.RichEmbed()
        .setDescription(`Member Left`)
        .setColor(logchannelColor)
        .setThumbnail(avatar)
        .addField("Member Name", member.user.username)
        .addField("Member ID", member.user.id)
        .addField("Joined On", member.joinedAt)
        .addField("Account Created", member.user.createdAt)
        .addField("Left On", new Date());
    // Check if there is an ID Now
    if (!logID) { // If no Log ID...
        bot.users.get(userids.ownerID).send(leaveEmbed);
    }
    else {
        let Channel = bot.channels.get(logID);
        Channel.send(leaveEmbed);
    }
    deleteMemberInfo_js_1.run(bot, member, sql);
}
exports.run = run;
