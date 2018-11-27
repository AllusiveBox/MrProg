﻿/*
    Command Name: stream.js
    Function: Marks the Bot's Stream Status
    Clearance: Admin+
	Default Enabled: Cannot be Disabled
    Date Created: 12/02/17
    Last Updated: 10/11/18
    Last Updated By: Th3_M4j0r

*/

// Load in Required Files
import * as Discord from 'discord.js';
import { debug, error as errorLog, commandHelp } from '../functions/log.js';
import { run as disabledDMs } from '../functions/disabledDMs.js';
import { run as hasElevatedPermissions } from '../functions/hasElevatedPermissions.js';
import betterSql from '../classes/betterSql.js';
import { commandBot } from '../classes/commandBot.js';
import { run as react } from '../functions/react.js';

import config = require('../files/config.json');
import channels = require('../files/channels.json');

// Command Variables
const announceChat = channels.announceChat;
var oldStatus = config.defaultStatus;
const command: commandHelp = {
    bigDescription: ("This command is used switch the bot's status (what the bot is currently 'streaming').\n"
        + "Returns:\n\t"
        + "DMs the user, informing them of the successful change or not and messages the announcement channel"),
    description: "Changes the bot to Stream Mode",
    enabled: null,
    fullName: "Stream",
    name: "stream",
    adminOnly: true,
    permissionLevel: "admin"
}

/**
 * 
 * @param {commandBot} bot
 * @param {Discord.Message} message
 * @param {string[]} args
 * @param {betterSql} sql
 */
export async function run(bot: commandBot, message: Discord.Message, args: string[], sql: betterSql) {
    // Debug to Console
    debug(`I am inside the ${command.fullName} command.`);

    if (! await hasElevatedPermissions(bot, message, command.adminOnly, sql)) return;

    let isStreaming = config.isStreaming;

    if (isStreaming) { // If Currently Streaming...
        debug(`isStreaming is set to: ${isStreaming}.`);
        //@ts-ignore
        let success = bot.commands.get("setstatus").updateStatus(bot, oldStatus, "PLAYING");
        if (!success) {
            let reply = `${message.author}, I was unable to leave streaming mode. Please wait a few seconds and try again.`;
            await react(message, false);
            return message.author.send(reply).catch(error => {
                return disabledDMs(message, reply);
            });
        }
        config.isStreaming = !isStreaming;
        bot.commands.get("question").help.enabled = false;
        let reply = `${message.author}, I have successfully left streaming mode!`;
        message.author.send(reply).catch(error => {
            disabledDMs(message, reply);
        });

        // Find the Announcement Channel
        if (!announceChat) { // If Annoucement Channel Not Defined...
            reply = (`No channel set for ${command.name} command. Please update `
                + `files/channels.json and add a channel for the announceChat entry. For a `
                + `template, please check in the templates directory.`);
            debug(reply);
            await react(message, false);
            return message.author.send(reply).catch(error => {
                return disabledDMs(message, reply);
            });
        }

        reply = ("everyone: We have finished streaming. Thanks for watching!");



        return (<Discord.TextChannel>bot.channels.get(announceChat)).send(reply).then(function () {
            return react(message);
        }).catch(error => {
            errorLog(error);
            message.author.send(`*${error.toString()}*`);
            return react(message, false);
        });
    } else { // Stream is Currently Off...
        debug(`isStreaming is set to: ${isStreaming}.`);
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
            await react(message, false);
            return message.author.send(reply).catch(error => {
                return disabledDMs(message, reply);
            });
        }
        config.isStreaming = !isStreaming;
        bot.commands.get("question").help.enabled = true;
        let reply = `${message.author}, I have successfully switched to streaming mode!`;
        message.author.send(reply).catch(error => {
            disabledDMs(message, reply);
        });

        // Find the Announcement Channel
        if (!announceChat) { // If Annoucement Channel Not Defined...
            reply = (`No channel set for ${command.name} command. Please update `
                + `files/channels.json and add a channel for the announceChat entry. For a `
                + `template, please check in the templates directory.`);
            debug(reply);
            await react(message, false);
            return message.author.send(reply).catch(error => {
                return disabledDMs(message, reply);
            });
        }

        reply = ("everyone: We have entered **Streaming Mode**\n"
            + `The ${config.prefix}question command is now enabled!`);

        return (<Discord.TextChannel>bot.channels.get(announceChat)).send(reply).then(function () {
            return react(message);
        }).catch(error => {
            errorLog(error);
            message.author.send(`*${error.toString()}*`);
            return react(message, false);
        });
    }
}

export const help = command;