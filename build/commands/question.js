"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const channels = require("../files/channels.json");
const config = require("../files/config.json");
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
async function run(bot, message, args) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.name, message);
    }
    if (dmCheck_js_1.run(message, command.name))
        return;
    if (talkedRecently.has(message.author.id)) {
        let reply = `${message.author}, slow down! Please do not spam questions.`;
        return message.author.send(reply).catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
    }
    let questionChannelColor = config.questionChannelColor;
    let questionID = channels.question;
    if (!questionID) {
        log_js_1.debug(`Unable to find the question ID in channels.json`
            + `Looking for another Question channel.`);
        let questionChannel = message.guild.channels.find(val => val.name === "question");
        if (!questionChannel) {
            log_js_1.debug(`Unable to find any kind of question channel. Silently disabling command.`);
            return command.enabled = false;
        }
        else {
            questionID = questionChannel.id;
        }
    }
    talkedRecently.add(message.author.id);
    setTimeout(() => {
        talkedRecently.delete(message.author.id);
    }, 30000);
    var question = args.join(" ");
    if (!question) {
        log_js_1.debug(`Unable to send an empty string!`);
        let reply = (`I am sorry, ${message.author}, I am unable to send an empty question.\n`
            + `Please make sure to ask a question!`);
        return message.author.send(reply).catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
    }
    let avatar = message.member.user.avatarURL;
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
