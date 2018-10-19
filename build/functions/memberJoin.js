"use strict";
/**

    cxBot.js Mr. Prog Member Joining Scripts
    Version: 4
    Author: AllusiveBox
    Date Started: 08/08/18
    Date Last Updated: 10/15/18
    Last Update By: AllusiveBox

**/
Object.defineProperty(exports, "__esModule", { value: true });
// Load in Required Libraries and Files
const Discord = require("discord.js");
const log_js_1 = require("../functions/log.js");
const welcomeMessage_js_1 = require("../functions/welcomeMessage.js");
const channels = require("../files/channels.json");
const config = require("../files/config.json");
const userIds = require("../files/userids.json");
/**
 *
 * @param {commandBot} bot
 * @param {Discord.Member} member
 */
async function run(bot, member) {
    // Debug to Console
    log_js_1.debug(`I am inside the memberLeave Function.`);
    // Get Log Channel Color
    let logchannelColor = config.logChannelColors.memberJoin;
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
    // Generate the Welcome Message
    let message = welcomeMessage_js_1.run(member);
    // Boolean to Find out if Message Was Sent Successfully or not
    var sentDM = true;
    await member.send(message).catch(error => {
        log_js_1.error(error);
        sentDM = false;
        log_js_1.debug(`Unable to DM user, setting sentDM to ${sentDM}.`);
    });
    // Get the Member's Avatar
    let avatar = member.user.avatarURL;
    // Build the Embed
    let joinEmbed = new Discord.RichEmbed()
        .setDescription(`Member Joined!`)
        .setColor(logchannelColor)
        .setThumbnail(avatar)
        .addField("Member Name", member.user.username)
        .addField("Member ID", member.user.id)
        .addField("Account Created", member.user.createdAt)
        .addField("Joined On", member.joinedAt)
        .addField("DM Successfully Sent", sentDM);
    // Check if there is an ID Now
    if (!logID) { // If no Log ID...
        bot.users.get(userIds.ownerID).send(joinEmbed);
    }
    else {
        let logChannel = bot.channels.get(logID);
        logChannel.send(joinEmbed);
    }
}
exports.run = run;
