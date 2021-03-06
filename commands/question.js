﻿/*
    Command Name: question.js
    Function: Asks a question to the Question Chat
    Clearance: none
	Default Enabled: Only during Streaming Sessions
    Date Created: 12/02/17
    Last Updated: 09/29/20
    Last Updated By: AllusiveBox

*/

// Load in Required Files
const Discord = require(`discord.js`);
const channels = require(`../files/channels.json`);
const config = require(`../files/config.json`);
const { debug, error: errorLog } = require(`../functions/log.js`);
const { run: disabledCommand } = require(`../functions/disabledCommand.js`);
const { run: disabledDMs } = require(`../functions/disabledDMs.js`);
const { run: dmCheck } = require(`../functions/dmCheck.js`);

// Command Variables
const talkedRecently = new Set();
const command = {
    bigDescription: ("Allows you to ask a question in the question channel (This command can only be used when the bot is set to streaming).\n"
        + "Required arguments: {string} -> The Question you want to ask.\n"
        + "Returns:\n\t"
        + "This command will generate a message in the question channel"),
    description: "Allows you to ask a question when streaming.",
    enabled: false,
    fullName: "Question",
    name: "question",
    permissionLevel: "normal"
}

/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 */
module.exports.run = async (bot, message, args) => {
    // Debug to Console
    debug(`I am inside the ${command.fullName} command.`);

    // Enabled Command Test
    if (!command.enabled) {
        return disabledCommand(command.name, message);
    }

    if (dmCheck(message, command.name)) return; // Return on DM channel

    if (talkedRecently.has(message.author.id)) {// If Member has used this command Recently...
        let reply = `${message.author}, slow down! Please do not spam questions.`;
        return message.author.send(reply).catch(error => {
            disabledDMs(message, reply);
        });
    }

    // Get Question Channel Color
    let questionChannelColor = config.questionChannelColor;

    // Load in the Question Channel ID
    let questionID = channels.question;

    // Check if there was an ID Provided
    if (!questionID) { // If no Question ID...
        debug(`Unable to find the question ID in channels.json`
            + `Looking for another Question channel.`);

        // Look for Question Channel in Server
        let questionChannel = member.guild.channels.cache.find(val => val.name === "question");
        if (!questionChannel) {
            debug(`Unable to find any kind of question channel. Silently disabling command.`);
            return command.enabled = false;
        } else {
            quesitonID = questionChannel.ID;
        }
    }

    // Add User to Set
    talkedRecently.add(message.author.id);
    setTimeout(() => {
        // Removed User from the Set after 30 Seconds.
        talkedRecently.delete(message.author.id);
    }, 30000);

    // Get the Question
    var question = args.join(" ");

    if (!question) { // If No Question Provided...
        debug(`Unable to send an empty string!`);

        // Build the Reply
        let reply = (`I am sorry, ${message.author}, I am unable to send an empty question.\n`
            + `Please make sure to ask a question!`);
        return message.author.send(reply).catch(error => {
            disabledDMs(message, reply);
        });
    }

    // Get the Member's Avatar
    let avatar = message.member.user.avatarURL;

    // Build the Question Embed
    let questionEmbed = new Discord.MessageEmbed()
        .setDescription(`Question`)
        .setColor(questionChannelColor)
        .setThumbnail(avatar)
        .addField("Asked By", message.author)
        .addField("Question", question)
        .addField("Asked on", new Date());

    return bot.channels.cache.get(questionID).send(questionEmbed).catch(error => {
        return errorLog(error);
    });
}

module.exports.help = command;