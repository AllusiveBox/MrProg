"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const hasElevatedPermissions_js_1 = require("../functions/hasElevatedPermissions.js");
const react_js_1 = require("../functions/react.js");
const config = require("../files/config.json");
const channels = require("../files/channels.json");
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
async function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!await hasElevatedPermissions_js_1.run(bot, message, command.adminOnly, sql))
        return;
    let isStreaming = config.isStreaming;
    if (isStreaming) {
        log_js_1.debug(`isStreaming is set to: ${isStreaming}.`);
        let success = bot.commands.get("setstatus").updateStatus(bot, oldStatus, "PLAYING");
        if (!success) {
            let reply = `${message.author}, I was unable to leave streaming mode. Please wait a few seconds and try again.`;
            await react_js_1.run(message, false);
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
        if (!announceChat) {
            reply = (`No channel set for ${command.name} command. Please update `
                + `files/channels.json and add a channel for the announceChat entry. For a `
                + `template, please check in the templates directory.`);
            log_js_1.debug(reply);
            await react_js_1.run(message, false);
            return message.author.send(reply).catch(error => {
                return disabledDMs_js_1.run(message, reply);
            });
        }
        reply = ("everyone: We have finished streaming. Thanks for watching!");
        return bot.channels.get(announceChat).send(reply).then(function () {
            return react_js_1.run(message);
        }).catch(error => {
            log_js_1.error(error);
            message.author.send(`*${error.toString()}*`);
            return react_js_1.run(message, false);
        });
    }
    else {
        log_js_1.debug(`isStreaming is set to: ${isStreaming}.`);
        oldStatus = bot.user.presence.game.name;
        let newStatus = "We are Streaming!";
        let method = "STREAMING";
        let streamURL = args.join(" ");
        if ((!streamURL) || (!streamURL.includes("www."))) {
            streamURL = "https://www.twitch.tv/mmbnchronox";
        }
        let success = bot.commands.get("setstatus").updateStatus(bot, newStatus, method, streamURL);
        if (!success) {
            let reply = `${message.author}, I was unable to switch to streaming mode. Please wait a few seconds and try again.`;
            await react_js_1.run(message, false);
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
        if (!announceChat) {
            reply = (`No channel set for ${command.name} command. Please update `
                + `files/channels.json and add a channel for the announceChat entry. For a `
                + `template, please check in the templates directory.`);
            log_js_1.debug(reply);
            await react_js_1.run(message, false);
            return message.author.send(reply).catch(error => {
                return disabledDMs_js_1.run(message, reply);
            });
        }
        reply = ("everyone: We have entered **Streaming Mode**\n"
            + `The ${config.prefix}question command is now enabled!`);
        return bot.channels.get(announceChat).send(reply).then(function () {
            return react_js_1.run(message);
        }).catch(error => {
            log_js_1.error(error);
            message.author.send(`*${error.toString()}*`);
            return react_js_1.run(message, false);
        });
    }
}
exports.run = run;
exports.help = command;
