/**
 * Mr. Prog Bot Script
 * Version 4.2.1
 * Author: AllusiveBox & Th3_M4j0r
 * Date Started: 09/21/18
 * Last Updated: 11/24/18
 * Last Updated By: AllusiveBox
 * 
 */

process.chdir(__dirname); // Ensure Working Directory is Same as Current File

// Load in Required Libraries and Files
import * as Discord from 'discord.js';
import * as fs from 'fs';
import * as readline from 'readline';
import { commandBot } from './classes/commandBot.js';
import betterSql from './classes/betterSql.js';

// Load in Required Functions
import { run as memberJoin } from './functions/memberJoin.js';
import { run as memberLeave } from './functions/memberLeave.js';
import { run as onStartup } from './functions/onStartup.js';
import { run as score } from './functions/score.js';
import { run as dmLog } from './functions/dmLog.js';
import { command as commandLog, debug, error as errorLog, commandHelp } from './functions/log.js';

//import required jsons
import bottoken = require('./files/bottoken.json');
import config = require('./files/config.json');
import includedCommands = require('./files/includedCommands.json');
import userids = require('./files/userids.json');
import channels = require('./files/channels.json');


const botOptions: Discord.ClientOptions = { //usually unnecessary and hurts performance
    disabledEvents: ["TYPING_START"]
}
// Declare the Bot Stuff
const bot = new commandBot(botOptions);
//bot.commands = new Discord.Collection<string, NodeModule>();

// Open SQ Database
const sql = new betterSql();
sql.open(`./files/userinfo.sqlite`);

// readline Stuff
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Misc.
var falseCommandUsedRecently: Set<Discord.Snowflake> = new Set();
var commandRegex: RegExp = new RegExp("[^A-Za-z0-9]");

fs.readdir(`./commands/`, async (error, files) => {
    if (error) {
        return errorLog(error);
    }

    let jsFile = files.filter(f => f.split(".").pop() === "js");
    if (jsFile.length <= 0) {
        return debug(`Unable to locate any commands!`);
    }
    if (!includedCommands) {
        throw Error("includedCommands.json not found");
    }
    jsFile.forEach(async (file, i) => {
        let toInclude = includedCommands[`${file.substring(0, file.indexOf("."))}`];

        // Test if Including Command
        if (toInclude === false) return debug(`${file} not loaded!`);

        // Require Command
        let props = require(`./commands/${file}`);

        bot.commands.set((<commandHelp>props.help).name.toLowerCase(), props);
    });
});

// Bot on Startup
bot.on("ready", async () => {
    debug(`${bot.user.username} is starting up...`);
    bot.commands.get("setstatus").updateStatus(bot, config.defaultStatus);
    onStartup(bot, process.argv);
});

// Bot on Unexpected Error
bot.on("uncaughtException", async (error) => {
    await errorLog(error);
    await sql.close();
    return process.exit(1) // Return Unexpected Error Code
});

// Bot on SIGINT 
process.on("SIGINT", async () => {
    await debug("SIGINT Detected. Shutting down...");
    await sql.close();
    return process.exit(2); // Return SIGINT Error Code
});

// Bot on Disconnect
bot.on("disconnect", async () => {
    await debug("Disconnecting...");
    await sql.close();
    return process.exit(3) // Return Disconnected Error Code
});

// Unhandled Rejection
process.on("unhandledRejection", async (reason, p) => {
    await errorLog(reason);
});

// Bot on Member Joining Server
bot.on("guildMemberAdd", async member => {
    try {
        await memberJoin(bot, member, sql);
    } catch (error) {
        errorLog(error);
    }
});

// Bot on Member Leave Server
bot.on("guildMemberRemove", async member => {
    if (bot.isKicking) {
        await debug("setting kick flag to false");
        bot.isKicking = false;
        return;
    }
    try {
        await memberLeave(bot, member, sql);
    } catch (error) {
        errorLog(error);
    }
});

bot.on("messageUpdate", async (oldMessage, newMessage) => {
    debug(`In the messageUpdate event.`);

    // Make sure Content exists...
    if ((oldMessage.content === null) || (newMessage.content === null) ||
        (oldMessage.content === undefined) || (newMessage.content === undefined) ||
        (oldMessage.content === "") || (newMessage.content === "")) return;

    // Load in Log Channel ID
    let logID = channels.log;

    if (!logID) { // If no Log ID...
        debug(`Unable to find log ID in channels.json. Looking for another log channel.`);

        // Look for Log Channel in Server
        let logChannel = oldMessage.member.guild.channels.find(val => val.name === "log");
        if (!logChannel) { // If Unable to Find Log Channel...
            return debug(`Unable to find any kind of log channel.`);
        } else {
            logID = logChannel.id;
        }

        // Load in Embed Message Color
        let logChannelColor = config.logChannelColors.messageUpdated;

        // Grab the User Information
        let avatar = oldMessage.member.user.avatarURL;

        // Build the Embed
        let updatedMessage = new Discord.RichEmbed()
            .setDescription("Message Updated!")
            .setColor(logChannelColor)
            .setThumbnail(avatar)
            .addField("Old Message", oldMessage.content)
            .addField("New Message", newMessage.content)
            .addField("Time", new Date());

        try {
            (<Discord.TextChannel>bot.channels.get(logID)).send(updatedMessage);
        } catch (error) {
            errorLog(error);
        }
    }
});

bot.on("messageDelete", async (deletedMessage) => {
    debug(`In the messageDelete event.`);

    // Make sure Content exists...
    if (deletedMessage.content === null || deletedMessage.content === undefined ||
        deletedMessage.content === "") return;

    // Load in Log Channel ID
    let logID = channels.log;

    if (!logID) { // If no Log ID...
        debug(`Unable to find log ID in channels.json. Looking for another log channel.`);

        // Look for Log Channel in Server
        let logChannel = deletedMessage.member.guild.channels.find(val => val.name === "log");
        if (!logChannel) { // If Unable to Find Log Channel...
            return debug(`Unable to find any kind of log channel.`);
        } else {
            logID = logChannel.id;
        }

        // Load in Embed Message Color
        let logChannelColor = config.logChannelColors.messageUpdated;

        // Grab the User Information
        let avatar = deletedMessage.member.user.avatarURL;

        // Build the Embed
        let deletedMessageEmbed = new Discord.RichEmbed()
            .setDescription("Message Deleted!")
            .setColor(logChannelColor)
            .setThumbnail(avatar)
            .addField("Deleted Message", deletedMessage.content)
            .addField("Time", new Date());

        try {
            (<Discord.TextChannel>bot.channels.get(logID)).send(deletedMessageEmbed);
        } catch (error) {
            errorLog(error);
        }
    }
})

rl.on(`line`, async (input) => {
    // Convert to Lowercase
    input = input.toLowerCase();

    // Check the Cases
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
            process.exit(88); // Non-restart Exit Code
            break;
        case 'r':
            console.log("Restarting...");
            process.exit(0); // Restart Exit Code
            break;
        case 'u':
            console.log("Restarting and checking for Bot Updates...");
            process.exit(99); // Restart and Update Exit Code
            break;
        default:
            break;
    }
})

// Message Handler
bot.on("message", async message => {
    let prefix = config.prefix;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();

    // Return on Bot Users
    if (message.author.bot) return;

    // Check if Bot is Accepting Commands or Not
    if (!config.isOn) { // If Bot is Not On...
        let validUser = false;
        Object.keys(userids).forEach(function (key) {
            if (userids[key] === message.author.id) { // If Member is in the User ID List...
                return validUser = true;
            }
        });

        // Return on Invalid Users
        if (!validUser) return;
    }

    // Check if DM
    if (message.channel.type !== "dm") { // If Message is Not a DM...
        await score(bot, message, sql);
    } else { // If Message is a DM...
        await dmLog(bot, message);
    }

    // Check if Command or Not
    if (!message.content.startsWith(prefix)) return; // Return on Not Commands.

    // Check for Valid Commands
    if (commandRegex.test(command)) {
        return debug(`Attempted use of Invalid Command Elements by ${message.author.username}.`);
    }
    /*if ((command.indexOf("/") > -1) || (command.indexOf(".") > -1) || (command.indexOf("\\") > -1)) {
        return debug(`Attempted use of Invalid Command Elements by ${message.author.username}.`);
    }*/

    let commandFile = bot.commands.get(command);
    if (commandFile) { // If the Command Exists...
        commandFile.run(bot, message, args, sql);
    } else {
        if (falseCommandUsedRecently.size > 0) {
            return;
        }
        falseCommandUsedRecently.add(message.author.id)
        setTimeout(() => {
            falseCommandUsedRecently.delete(message.author.id);
        }, 300000) // Remove After 5 Minutes
        /*
        return message.channel.send(`This is where I'd put a ${command}...\n`
            + `***IF I HAD ONE.*** (╯°□°）╯︵ ┻━┻`);
        */
    }

    // Log Commands
    await commandLog(message.author, command, args);
});
debug("logging in");
bot.login(bottoken.token);