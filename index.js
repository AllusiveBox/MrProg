/**
 * Mr. Prog Bot Script
 * Version 4.2.2
 * Author: AllusiveBox & Th3_M4j0r
 * Date Started: 09/21/18
 * Last Updated: 04/13/19
 * Last Updated By: AllusiveBox
 * 
 */

process.chdir(__dirname); // Ensure Working Directory is Same as Current File

// Load in Required Libraries and Files
const readline = require(`readline`);
const Discord = require(`discord.js`);
const fs = require(`fs`);
const betterSql = require(`./classes/betterSql.js`);
const bottoken = require(`./files/bottoken.json`);
const config = require(`./files/config.json`);
const channels = require(`./files/channels.json`);
const includedCommands = require(`./files/includedCommands.json`);
const userids = require(`./files/userids.json`);

// Load in Required Functions
const { run: dmLog } = require(`./functions/dmLog.js`);
const { messageUpdate, messageDelete } = require(`./functions/messageChanges.js`);
const { run: memberJoin } = require(`./functions/memberJoin.js`);
const { run: memberLeave } = require(`./functions/memberLeave.js`);
const { run: onStartup } = require(`./functions/onStartup.js`);
const { run: score } = require(`./functions/score.js`);
const { command: commandLog, debug, error: errorLog, boot} = require(`./functions/log.js`);

// Declare the Bot Stuff
const bot = new Discord.Client({ disableEveryone: true });
bot.commands = new Discord.Collection();

// readline Stuff
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Misc.
falseCommandUsedRecently = new Set();
var commandRegex = new RegExp("[^A-Za-z0-9]");

boot("\t====================== Starting Script ======================\n\n", "none");
fs.readdir(`./commands/`, async (error, files) => {
    if (error) {
        return boot(error, "error");
    }

    let jsFile = files.filter(f => f.split(".").pop() === "js");
    if (jsFile.length <= 0) {
        return boot(error, "error");
    }

    jsFile.forEach(async (file, i) => {
        let toInclude = includedCommands[`${file.substring(0, file.indexOf("."))}`];

        // Test if Including Command
        if (!toInclude) {
            return boot(`${file} commad not loaded`, "warn");
        } else {
            boot(`${file} command loaded`);
        }


        let props = require(`./commands/${file}`);

        bot.commands.set(props.help.name.toLowerCase(), props);
    });
});

// Open SQ Database
const sql = new betterSql();
try {
    let path = `./files/userinfo.sqlite`;
    boot(`Opening sqlite DB at ${path}`);
    sql.open(path);
    boot("Preparing Statements");
    boot("Statements Loaded");
} catch (error) {
    boot(error, "error");
}

// Bot on Startup
bot.on("ready", async () => {
    boot(`Setting status to ${config.defaultStatus}`);
    try {
        bot.user.setActivity(config.defaultStatus);
        boot(`Status Successfully updated`);
    } catch (error) {
        boot(error, "error");
    }

    await onStartup(bot, process.argv);

    fs.writeFile("bootLog.txt", boot(), function (error) {
        if (error) {
            errorLog(error);
        } else {
            debug("Successfully logged the booting proceedure. Switching from bootlog to debug log.");
            // Load in Log Channel ID
            let logID = channels.log;
            if (logID) bot.channels.get(logID).send({ file: `./bootLog.txt` });
        }
    });
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
    if ((reason) && (reason.toString().includes("getaddrinfo"))) {
		await sql.close();
        return process.exit(4);
    } else if ((reason) && (reason.toString().includes("ECONNRESET"))) {
		await sql.close();
		return process.exit(5);
	}
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
    if (config.isKicking) return config.isKicking = false;
    try {
        await memberLeave(bot, member, sql);
    } catch (error) {
        errorLog(error);
    }
});

bot.on("messageUpdate", async (oldMessage, newMessage) => {
    if (oldMessage.channel.type !== "dm") { // If Message is Not a DM...
        messageUpdate(bot, oldMessage, newMessage);
    }
});

bot.on("messageDelete", async (deletedMessage) => {
    if (deletedMessage.channel.type !== "dm") { // If Message is Not a DM...
        messageDelete(bot, deletedMessage);
    }
});

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
    if(commandRegex.test(command)) {
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
    await commandLog(message.author.username, command, args);
});

bot.login(bottoken.token);