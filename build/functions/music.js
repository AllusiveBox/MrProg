"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const hasElevatedPermissions_js_1 = require("./hasElevatedPermissions.js");
const log_js_1 = require("./log.js");
const StreamOptions = { bitrate: "auto", passes: 3 };
const songPath = '../files/song.ogg';
var playQueues = new Discord.Collection();
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
async function leave(bot, message) {
    log_js_1.debug(`I am inside the music.leave function`);
    if (!message.guild.voiceConnection) {
        message.channel.send("I'm not in a voice channel");
        return false;
    }
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
function addEndEvent(bot, dispatcher, guildID) {
    dispatcher.on('end', () => {
        if (playQueues.has(guildID) && playQueues.get(guildID).length !== 0) {
            let guild = bot.guilds.get(guildID);
            let newDispatcher = guild.voiceConnection.playFile(playQueues.get(guildID).shift(), StreamOptions);
            addEndEvent(bot, newDispatcher, guildID);
        }
    });
}
