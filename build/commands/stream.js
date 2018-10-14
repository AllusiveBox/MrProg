"use strict";
/*
    Command Name: stream.js
    Function: Marks the Bot's Stream Status
    Clearance: Admin+
    Default Enabled: Cannot be Disabled
    Date Created: 12/02/17
    Last Updated: 10/11/18
    Last Updated By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const hasElevatedPermissions_js_1 = require("../functions/hasElevatedPermissions.js");
const config = require("../files/config.json");
const channels = require("../files/channels.json");
// Command Variables
const announceChat = channels.announceChat;
var oldStatus = config.defaultStatus;
const command = {
    bigDescription: ("This command is used switch the bot's status (what the bot is currently 'streaming').\n"
        + "Returns:\n\t"
        + "DMs the user, informing them of the successful change or not and messages the announcement channel"),
    description: "Changes the bot to Stream Mode",
    enabled: null,
    fullName: "Stream",
    name: "stream",
    adminOnly: true,
    permissionLevel: "admin"
};
/**
 *
 * @param {commandBot} bot
 * @param {Discord.Message} message
 * @param {string[]} args
 * @param {betterSql} sql
 */
async function run(bot, message, args, sql) {
    // Debug to Console
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!await hasElevatedPermissions_js_1.run(bot, message, command.adminOnly, sql))
        return;
    let isStreaming = config.isStreaming;
    if (isStreaming) { // If Currently Streaming...
        log_js_1.debug(`isStreaming is set to: ${isStreaming}.`);
        //@ts-ignore
        let success = bot.commands.get("setstatus").updateStatus(bot, oldStatus, "PLAYING");
        if (!success) {
            let reply = `${message.author}, I was unable to leave streaming mode. Please wait a few seconds and try again.`;
            return message.author.send(reply).catch(error => {
                return disabledDMs_js_1.run(message, reply);
            });
        }
        config.isStreaming = !isStreaming;
        bot.commands.get("question").help.enabled = false;
        let reply = `${message.author}, I have successfully left streaming mode!`;
        message.author.send(reply).catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
        // Find the Announcement Channel
        if (!announceChat) { // If Annoucement Channel Not Defined...
            reply = (`No channel set for ${command.name} command. Please update `
                + `files/channels.json and add a channel for the announceChat entry. For a `
                + `template, please check in the templates directory.`);
            log_js_1.debug(reply);
            return message.author.send(reply).catch(error => {
                return disabledDMs_js_1.run(message, reply);
            });
        }
        reply = ("@everyone: We have finished streaming. Thanks for watching!");
        return bot.channels.get(announceChat).send(reply).catch(error => {
            log_js_1.error(error);
            return message.author.send(`ERROR! Please check error.txt!`);
        });
    }
    else { // Stream is Currently Off...
        log_js_1.debug(`isStreaming is set to: ${isStreaming}.`);
        oldStatus = bot.user.presence.game.name;
        let newStatus = "We are Streaming!";
        let method = "STREAMING";
        let streamURL = args.join(" ");
        if ((!streamURL) || (!streamURL.includes("www."))) { // If Invalid Stream URL...
            streamURL = "https://www.twitch.tv/mmbnchronox";
        }
        //@ts-ignore
        let success = bot.commands.get("setstatus").updateStatus(bot, newStatus, method, streamURL);
        if (!success) {
            let reply = `${message.author}, I was unable to switch to streaming mode. Please wait a few seconds and try again.`;
            return message.author.send(reply).catch(error => {
                return disabledDMs_js_1.run(message, reply);
            });
        }
        config.isStreaming = !isStreaming;
        bot.commands.get("question").help.enabled = true;
        let reply = `${message.author}, I have successfully switched to streaming mode!`;
        message.author.send(reply).catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
        // Find the Announcement Channel
        if (!announceChat) { // If Annoucement Channel Not Defined...
            reply = (`No channel set for ${command.name} command. Please update `
                + `files/channels.json and add a channel for the announceChat entry. For a `
                + `template, please check in the templates directory.`);
            log_js_1.debug(reply);
            return message.author.send(reply).catch(error => {
                return disabledDMs_js_1.run(message, reply);
            });
        }
        reply = ("@everyone: We have entered **Streaming Mode**\n"
            + `The ${config.prefix}question command is now enabled!`);
        return bot.channels.get(announceChat).send(reply).catch(error => {
            log_js_1.error(error);
            return message.author.send(`ERROR! Please check error.txt!`);
        });
    }
}
exports.run = run;
exports.help = command;
