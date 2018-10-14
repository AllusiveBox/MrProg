"use strict";
/*
    Command Name: question.js
    Function: Asks a question to the Question Chat
    Clearance: none
    Default Enabled: Only during Streaming Sessions
    Date Created: 12/02/17
    Last Updated: 10/10/18
    Last Updated By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
// Load in Required Files
const Discord = require("discord.js");
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const channels = require("../files/channels.json");
const config = require("../files/config.json");
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
};
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 */
async function run(bot, message, args) {
    // Debug to Console
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    // Enabled Command Test
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.name, message);
    }
    if (dmCheck_js_1.run(message, command.name))
        return; // Return on DM channel
    if (talkedRecently.has(message.author.id)) { // If Member has used this command Recently...
        let reply = `${message.author}, slow down! Please do not spam questions.`;
        return message.author.send(reply).catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
    }
    // Get Question Channel Color
    let questionChannelColor = config.questionChannelColor;
    // Load in the Question Channel ID
    let questionID = channels.question;
    // Check if there was an ID Provided
    if (!questionID) { // If no Question ID...
        log_js_1.debug(`Unable to find the question ID in channels.json`
            + `Looking for another Question channel.`);
        // Look for Question Channel in Server
        let questionChannel = message.guild.channels.find(val => val.name === "question");
        if (!questionChannel) {
            log_js_1.debug(`Unable to find any kind of question channel. Silently disabling command.`);
            return command.enabled = false;
        }
        else {
            questionID = questionChannel.id;
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
        log_js_1.debug(`Unable to send an empty string!`);
        // Build the Reply
        let reply = (`I am sorry, ${message.author}, I am unable to send an empty question.\n`
            + `Please make sure to ask a question!`);
        return message.author.send(reply).catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
    }
    // Get the Member's Avatar
    let avatar = message.member.user.avatarURL;
    // Build the Question Embed
    let questionEmbed = new Discord.RichEmbed()
        .setDescription(`Question`)
        .setColor(questionChannelColor)
        .setThumbnail(avatar)
        .addField("Asked By", message.author)
        .addField("Question", question)
        .addField("Asked on", new Date());
    let Channel = bot.channels.get(questionID);
    Channel.send(questionEmbed).catch(error => {
        return log_js_1.error(error);
    });
}
exports.run = run;
exports.help = command;
