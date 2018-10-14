"use strict";
/**

    cxBot.js Mr. Prog music script
    Version: 1
    Author: Th3_M4j0r
    Date Started: 09/02/18
    Date Last Updated: 10/10/18
    Last Update By: Th3_M4j0r

**/
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const hasElevatedPermissions_js_1 = require("./hasElevatedPermissions.js");
const log_js_1 = require("./log.js");
//options for audio streams
const StreamOptions = { bitrate: "auto", passes: 3 };
const songPath = '../files/song.ogg';
/**
 *
 * Collection keyed by guildID that stores the playQueue
 * for that guild
 *
 * @type {Discord.Collection<Discord.Snowflake, string[]>}
 */
var playQueues = new Discord.Collection();
/**
 *
 * function for joining a voice channel,
 * assumes caller checks for if the user has permission to use.
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @returns {Promise<boolean>} was the join successful or not
 */
async function join(bot, message) {
    log_js_1.debug(`I am inside the music.join function`);
    if (!message.member.voiceChannel) {
        message.channel.send("I'm sorry, you must be in a voice channel to use this command");
        return false;
    }
    if (message.guild.voiceConnection) {
        message.channel.send("I'm sorry, I'm already in a voice channel");
        return false;
    }
    if (message.member.voiceChannel.joinable) {
        await message.member.voiceChannel.join();
        message.channel.send("Connected");
        log_js_1.debug(`I have joined the voice channel: ${message.guild.voiceConnection.channel.name}`);
        return true;
    }
    else {
        message.channel.send("I'm sorry I cannot join that voice channel");
        return false;
    }
}
exports.join = join;
/**
 *
 * function for leaving a voice channel,
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @returns {Promise<boolean>} was a voice channel left or not?
 */
async function leave(bot, message) {
    log_js_1.debug(`I am inside the music.leave function`);
    if (!message.guild.voiceConnection) {
        message.channel.send("I'm not in a voice channel");
        return false;
    }
    //user must be in the same channel as the bot, unless they are a mod
    if (!message.member.voiceChannel || message.member.voiceChannel.id !== message.guild.voiceConnection.channel.id) {
        if (!await hasElevatedPermissions_js_1.run(bot, message, false, null, true))
            return false;
    }
    log_js_1.debug(`I am leaving the voice channel: ${message.guild.voiceConnection.channel.name}`);
    if (message.guild.voiceConnection.dispatcher) {
        if (playQueues.has(message.guild.id)) {
            playQueues.delete(message.guild.id);
        }
        message.guild.voiceConnection.dispatcher.end();
    }
    message.guild.voiceConnection.channel.leave();
    return true;
}
exports.leave = leave;
/**
 *
 * function for playing audio
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string} arg
 * @returns {Promise<?Discord.StreamDispatcher>} //returns the current audio dispatcher if successful
 */
async function play(bot, message, arg) {
    log_js_1.debug(`I am inside the music.play function`);
    if (!message.guild.voiceConnection) {
        message.channel.send("I'm not in a voice channel");
        return null;
    }
    if (!message.member.voiceChannel || message.member.voiceChannel.id !== message.guild.voiceConnection.channel.id) {
        message.channel.send(`You must be in the same voice channel as me to play anything`);
        return null;
    }
    if (!message.guild.voiceConnection.dispatcher) {
        let dispatcher = message.guild.voiceConnection.playFile(songPath, StreamOptions);
        addEndEvent(bot, dispatcher, message.guild.id);
        message.channel.send(`Playing \`${arg}\``);
        return dispatcher;
    }
    else {
        if (playQueues.has(message.guild.id)) {
            playQueues.get(message.guild.id).push(songPath);
        }
        else {
            playQueues.set(message.guild.id, [songPath]);
        }
        message.channel.send(`Adding \`${arg}\` to the queue`);
        return message.guild.voiceConnection.dispatcher;
    }
}
exports.play = play;
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.StreamDispatcher} dispatcher
 * @param {Discord.Snowflake} guildID
 * @returns {void}
 */
function addEndEvent(bot, dispatcher, guildID) {
    dispatcher.on('end', () => {
        if (playQueues.has(guildID) && playQueues.get(guildID).length !== 0) {
            let guild = bot.guilds.get(guildID);
            let newDispatcher = guild.voiceConnection.playFile(playQueues.get(guildID).shift(), StreamOptions);
            addEndEvent(bot, newDispatcher, guildID);
        }
    });
}
