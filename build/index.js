"use strict";
/**
 * Mr. Prog Bot Script
 * Version 4.1.0
 * Author: AllusiveBox & Th3_M4j0r
 * Date Started: 09/21/18
 * Last Updated: 10/19/18
 * Last Updated By: Th3_M4j0r
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
process.chdir(__dirname); // Ensure Working Directory is Same as Current File
const fs = require("fs");
const commandBot_js_1 = require("./classes/commandBot.js");
const betterSql_js_1 = require("./classes/betterSql.js");
// Load in Required Functions
const memberJoin_js_1 = require("./functions/memberJoin.js");
const memberLeave_js_1 = require("./functions/memberLeave.js");
const onStartup_js_1 = require("./functions/onStartup.js");
const score_js_1 = require("./functions/score.js");
const log_js_1 = require("./functions/log.js");
//import required jsons
const bottoken = require("./files/bottoken.json");
const config = require("./files/config.json");
const includedCommands = require("./files/includedCommands.json");
const userids = require("./files/userids.json");
const botOptions = {
    disabledEvents: ["TYPING_START"]
};
// Declare the Bot Stuff
const bot = new commandBot_js_1.commandBot(botOptions);
//bot.commands = new Discord.Collection<string, NodeModule>();
// Open SQ Database
const sql = new betterSql_js_1.default();
sql.open(`./files/userinfo.sqlite`);
// Misc.
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
        // Test if Including Command
        if (toInclude === false)
            return log_js_1.debug(`${file} not loaded!`);
        // Require Command
        let props = require(`./commands/${file}`);
        bot.commands.set(props.help.name.toLowerCase(), props);
    });
});
// Bot on Startup
bot.on("ready", async () => {
    log_js_1.debug(`${bot.user.username} is starting up...`);
    bot.commands.get("setstatus").updateStatus(bot, config.defaultStatus);
    onStartup_js_1.run(bot, process.argv);
});
// Bot on Unexpected Error
bot.on("uncaughtException", async (error) => {
    await log_js_1.error(error);
    await sql.close();
    return process.exit(1); // Return Unexpected Error Code
});
// Bot on SIGINT 
process.on("SIGINT", async () => {
    await log_js_1.debug("SIGINT Detected. Shutting down...");
    await sql.close();
    return process.exit(2); // Return SIGINT Error Code
});
// Bot on Disconnect
bot.on("disconnect", async () => {
    await log_js_1.debug("Disconnecting...");
    await sql.close();
    return process.exit(3); // Return Disconnected Error Code
});
// Unhandled Rejection
process.on("unhandledRejection", async (reason, p) => {
    await log_js_1.error(reason);
});
// Bot on Member Joining Server
bot.on("guildMemberAdd", async (member) => {
    try {
        await memberJoin_js_1.run(bot, member);
    }
    catch (error) {
        log_js_1.error(error);
    }
});
// Bot on Member Leave Server
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
bot.on("guildBanAdd", async (guild, member) => {
    log_js_1.debug("Member was Banned...");
});
// Message Handler
bot.on("message", async (message) => {
    let prefix = config.prefix;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    // Return on Bot Users
    if (message.author.bot)
        return;
    // Check if Bot is Accepting Commands or Not
    if (!config.isOn) { // If Bot is Not On...
        let validUser = false;
        Object.keys(userids).forEach(function (key) {
            if (userids[key] === message.author.id) { // If Member is in the User ID List...
                return validUser = true;
            }
        });
        // Return on Invalid Users
        if (!validUser)
            return;
    }
    // Check if DM
    if (message.channel.type !== "dm")
        await score_js_1.run(bot, message, sql);
    // Check if Command or Not
    if (!message.content.startsWith(prefix))
        return; // Return on Not Commands.
    // Check for Valid Commands
    if (commandRegex.test(command)) {
        return log_js_1.debug(`Attempted use of Invalid Command Elements by ${message.author.username}.`);
    }
    /*if ((command.indexOf("/") > -1) || (command.indexOf(".") > -1) || (command.indexOf("\\") > -1)) {
        return debug(`Attempted use of Invalid Command Elements by ${message.author.username}.`);
    }*/
    let commandFile = bot.commands.get(command);
    if (commandFile) { // If the Command Exists...
        commandFile.run(bot, message, args, sql);
    }
    else {
        if (falseCommandUsedRecently.size > 0) {
            return;
        }
        falseCommandUsedRecently.add(message.author.id);
        setTimeout(() => {
            falseCommandUsedRecently.delete(message.author.id);
        }, 300000); // Remove After 5 Minutes
        /*
        return message.channel.send(`This is where I'd put a ${command}...\n`
            + `***IF I HAD ONE.*** (╯°□°）╯︵ ┻━┻`);
        */
    }
    // Log Commands
    await log_js_1.command(message.author, command, args);
});
log_js_1.debug("logging in");
bot.login(bottoken.token);
