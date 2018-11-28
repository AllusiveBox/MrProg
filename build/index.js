"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.chdir(__dirname);
const Discord = require("discord.js");
const fs = require("fs");
const readline = require("readline");
const commandBot_js_1 = require("./classes/commandBot.js");
const betterSql_js_1 = require("./classes/betterSql.js");
const memberJoin_js_1 = require("./functions/memberJoin.js");
const memberLeave_js_1 = require("./functions/memberLeave.js");
const onStartup_js_1 = require("./functions/onStartup.js");
const score_js_1 = require("./functions/score.js");
const dmLog_js_1 = require("./functions/dmLog.js");
const log_js_1 = require("./functions/log.js");
const bottoken = require("./files/bottoken.json");
const config = require("./files/config.json");
const includedCommands = require("./files/includedCommands.json");
const userids = require("./files/userids.json");
const channels = require("./files/channels.json");
const botOptions = {
    disabledEvents: ["TYPING_START"]
};
const bot = new commandBot_js_1.commandBot(botOptions);
const sql = new betterSql_js_1.default();
sql.open(`./files/userinfo.sqlite`);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
var falseCommandUsedRecently = new Set();
var commandRegex = new RegExp("[^A-Za-z0-9]");
fs.readdir(`./commands/`, async (error, files) => {
    if (error) {
        return log_js_1.error(error);
    }
    let jsFile = files.filter(f => f.split(".").pop() === "js");
    if (jsFile.length <= 0) {
        return log_js_1.debug(`Unable to locate any commands!`);
    }
    if (!includedCommands) {
        throw Error("includedCommands.json not found");
    }
    jsFile.forEach(async (file, i) => {
        let toInclude = includedCommands[`${file.substring(0, file.indexOf("."))}`];
        if (toInclude === false)
            return log_js_1.debug(`${file} not loaded!`);
        let props = require(`./commands/${file}`);
        bot.commands.set(props.help.name.toLowerCase(), props);
    });
});
bot.on("ready", async () => {
    log_js_1.debug(`${bot.user.username} is starting up...`);
    bot.commands.get("setstatus").updateStatus(bot, config.defaultStatus);
    onStartup_js_1.run(bot, process.argv);
});
bot.on("uncaughtException", async (error) => {
    await log_js_1.error(error);
    await sql.close();
    return process.exit(1);
});
process.on("SIGINT", async () => {
    await log_js_1.debug("SIGINT Detected. Shutting down...");
    await sql.close();
    return process.exit(2);
});
bot.on("disconnect", async () => {
    await log_js_1.debug("Disconnecting...");
    await sql.close();
    return process.exit(3);
});
process.on("unhandledRejection", async (reason, p) => {
    await log_js_1.error(reason);
});
bot.on("guildMemberAdd", async (member) => {
    try {
        await memberJoin_js_1.run(bot, member, sql);
    }
    catch (error) {
        log_js_1.error(error);
    }
});
bot.on("guildMemberRemove", async (member) => {
    if (bot.isKicking) {
        await log_js_1.debug("setting kick flag to false");
        bot.isKicking = false;
        return;
    }
    try {
        await memberLeave_js_1.run(bot, member, sql);
    }
    catch (error) {
        log_js_1.error(error);
    }
});
bot.on("messageUpdate", async (oldMessage, newMessage) => {
    log_js_1.debug(`In the messageUpdate event.`);
    if ((oldMessage.content === null) || (newMessage.content === null) ||
        (oldMessage.content === undefined) || (newMessage.content === undefined) ||
        (oldMessage.content === "") || (newMessage.content === ""))
        return;
    if (oldMessage.content === newMessage.content)
        return log_js_1.debug("Messages are the same!");
    let logID = channels.log;
    if (!logID) {
        log_js_1.debug(`Unable to find log ID in channels.json. Looking for another log channel.`);
        let logChannel = oldMessage.member.guild.channels.find(val => val.name === "log");
        if (!logChannel) {
            return log_js_1.debug(`Unable to find any kind of log channel.`);
        }
        else {
            logID = logChannel.id;
        }
    }
    let logChannelColor = config.logChannelColors.messageUpdated;
    let avatar = oldMessage.member.user.avatarURL;
    let updatedMessage = new Discord.RichEmbed()
        .setDescription("Message Updated!")
        .setColor(logChannelColor)
        .setThumbnail(avatar)
        .addField("Old Message", oldMessage.content)
        .addField("New Message", newMessage.content)
        .addField("Time", new Date());
    try {
        bot.channels.get(logID).send(updatedMessage);
    }
    catch (error) {
        log_js_1.error(error);
    }
});
bot.on("messageDelete", async (deletedMessage) => {
    log_js_1.debug(`In the messageDelete event.`);
    if (deletedMessage.content === null || deletedMessage.content === undefined ||
        deletedMessage.content === "")
        return;
    let logID = channels.log;
    if (!logID) {
        log_js_1.debug(`Unable to find log ID in channels.json. Looking for another log channel.`);
        let logChannel = deletedMessage.member.guild.channels.find(val => val.name === "log");
        if (!logChannel) {
            return log_js_1.debug(`Unable to find any kind of log channel.`);
        }
        else {
            logID = logChannel.id;
        }
    }
    let logChannelColor = config.logChannelColors.messageUpdated;
    let avatar = deletedMessage.member.user.avatarURL;
    let deletedMessageEmbed = new Discord.RichEmbed()
        .setDescription("Message Deleted!")
        .setColor(logChannelColor)
        .setThumbnail(avatar)
        .addField("Deleted Message", deletedMessage.content)
        .addField("Time", new Date());
    try {
        bot.channels.get(logID).send(deletedMessageEmbed);
    }
    catch (error) {
        log_js_1.error(error);
    }
});
rl.on(`line`, async (input) => {
    input = input.toLowerCase();
    switch (input) {
        case 'd':
            config.debug = !config.debug;
            console.log(`Debug flag set to: ${config.debug}`);
            break;
        case 'off':
            await bot.commands.get("off").silent(bot);
            break;
        case 'on':
            await bot.commands.get("on").silent(bot);
            break;
        case 'q':
            console.log("Shutting down...");
            process.exit(88);
            break;
        case 'r':
            console.log("Restarting...");
            process.exit(0);
            break;
        case 'u':
            console.log("Restarting and checking for Bot Updates...");
            process.exit(99);
            break;
        default:
            break;
    }
});
bot.on("message", async (message) => {
    let prefix = config.prefix;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    if (message.author.bot)
        return;
    if (!config.isOn) {
        let validUser = false;
        Object.keys(userids).forEach(function (key) {
            if (userids[key] === message.author.id) {
                return validUser = true;
            }
        });
        if (!validUser)
            return;
    }
    if (message.channel.type !== "dm") {
        await score_js_1.run(bot, message, sql);
    }
    else {
        await dmLog_js_1.run(bot, message);
    }
    if (!message.content.startsWith(prefix))
        return;
    if (commandRegex.test(command)) {
        return log_js_1.debug(`Attempted use of Invalid Command Elements by ${message.author.username}.`);
    }
    let commandFile = bot.commands.get(command);
    if (commandFile) {
        commandFile.run(bot, message, args, sql);
    }
    else {
        if (falseCommandUsedRecently.size > 0) {
            return;
        }
        falseCommandUsedRecently.add(message.author.id);
        setTimeout(() => {
            falseCommandUsedRecently.delete(message.author.id);
        }, 300000);
    }
    await log_js_1.command(message.author, command, args);
});
log_js_1.debug("logging in");
bot.login(bottoken.token);
