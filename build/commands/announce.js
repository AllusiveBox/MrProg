"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const CustomErrors_js_1 = require("../classes/CustomErrors.js");
const log_js_1 = require("../functions/log.js");
const channels = require("../files/channels.json");
const userids = require("../files/userids.json");
const roles = require("../files/roles.json");
const config = require("../files/config.json");
try {
    var text = fs_1.readFileSync(`./files/announcement.txt`, `utf8`);
}
catch (error) {
    throw new CustomErrors_js_1.NoAnnouncementTextDefined();
}
const alertMe = roles.alertMe;
var announceChat = channels.announceChat;
var announcement = text.split('\n');
const command = {
    bigDescription: (`This command is used to ping the ${roles.alertMe.name} role when the bot updates.\n`
        + "Returns:\n\t"
        + "This command will generate a message in whatever is assigned as the announceChat channel."),
    description: `Generates the announcement text for the ${roles.alertMe.name} role.`,
    enabled: null,
    fullName: "Announce",
    name: "announce",
    permissionLevel: "owner"
};
function getAnnouncement(message) {
    if (!message) {
        return announcement;
    }
    else {
        message.channel.send(announcement);
    }
}
exports.getAnnouncement = getAnnouncement;
function setAnnouncement(newAnnouncement, message) {
    announcement = newAnnouncement.split('\n');
    if (!message) {
        return log_js_1.debug(`Announcement successfully updated!`);
    }
    else {
        return message.channel.send(`Announcement successfully updated!`);
    }
}
function updateAnnouncement(updateText, message) {
    announcement = `${announcement}${updateText}`.split('\n');
    let stream = fs_1.createWriteStream(`./files/command.announcement.txt`, `utf8`);
    stream.write(announcement);
    stream.end();
    log_js_1.debug(`Updating announcement to \n${announcement}`);
    if (!message) {
        return;
    }
    else {
        return message.channel.send(announcement);
    }
}
exports.updateAnnouncement = updateAnnouncement;
function resetAnnouncement(message) {
    announcement = [];
    let stream = fs_1.createWriteStream(`./files/command.announcement.txt`, `utf8`);
    stream.write(announcement);
    stream.end();
    log_js_1.debug(`Announcement reset!`);
    if (!message) {
        return log_js_1.debug(`Announcement reset!`);
    }
    else {
        return message.channel.send(`Announcement reset!`);
    }
}
exports.resetAnnouncement = resetAnnouncement;
async function run(bot, message) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (message.author.id !== userids.ownerID) {
        return log_js_1.debug(`Attempted use of ${command.fullName} by ${message.author.username}.`);
    }
    if (!alertMe) {
        let reply = (`No role set for alertMe. Please update files/roles.json`
            + ` and add a role for the "alertMe" entry. For a template, please check `
            + `in the templates directory.`);
        log_js_1.debug(reply);
        await message.react(config.fail);
        return message.channel.send(reply);
    }
    if (!announceChat) {
        let reply = (`No channel set for ${command.name} command. Please update `
            + `files/channels.json and add a role for the "announceChat" entry. For a `
            + `tmplate, please check in the templates directory.`);
        log_js_1.debug(reply);
        await message.react(config.fail);
        return message.channel.send(reply);
    }
    if (!announcement) {
        let reply = (`No announcement.txt file was able to be located. `
            + `Please ensure that there is a files/announcement.txt file and that it `
            + `is in the right directory.`);
        log_js_1.debug(reply);
        await message.react(config.fail);
        return message.channel.send(reply);
    }
    let announceChannel = bot.channels.get(announceChat);
    announceChannel.send(`<@&${alertMe.ID}>: The bot has recently `
        + `been updated! Below is a list of changes.\n`
        + `If you have any command suggestions, send a DM to <@${userids.ownerID}>.`
        + ` It's easier to keep up with them that way.\n\n`);
    bot.channels.get(command.announceChat).send(command.announcement).catch(error => {
        log_js_1.error(error);
        message.react(config.fail);
        return message.channel.send(`*${error.toString()}*`);
    });
    await message.react(config.success);
    return bot.channels.get(command.announceChat).send(`To report bugs, issues, or suggest new features/commands, please use the github repo!\n`
        + `https://github.com/AllusiveBox/discordBot/issues`);
}
exports.run = run;
exports.help = command;
