"use strict";
/*
    Command Name: announceChange.js
    Function: The Bot Lists the Change log to the BulletBoard Channel.
    Clearance: Owner Only
    Default Enabled: Cannot be Disabled
    Date Created: 12/03/17
    Last Updated: 10/13/18
    Last Update By: Th3_M4j0r

*/
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const CustomErrors_js_1 = require("../classes/CustomErrors.js");
const log_js_1 = require("../functions/log.js");
const channels = require("../files/channels.json");
const userids = require("../files/userids.json");
const roles = require("../files/roles.json");
// Command Variables
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
/**
 *
 * @param {Discord.Message | null} [message]
 */
function getAnnouncement(message) {
    if (!message) { // If No Message Param Provided...
        return announcement;
    }
    else {
        message.channel.send(announcement);
    }
}
exports.getAnnouncement = getAnnouncement;
/**
 *
 * @param {string} newAnnouncement
 * @param {Discord.Message} [message]
 */
function setAnnouncement(newAnnouncement, message) {
    announcement = newAnnouncement.split('\n');
    if (!message) { // If No Message Param Provided...
        return log_js_1.debug(`Announcement successfully updated!`);
    }
    else {
        return message.channel.send(`Announcement successfully updated!`);
    }
}
/**
 *
 * @param {string} updateText
 * @param {?Discord.Message} [message = null]
 */
function updateAnnouncement(updateText, message) {
    announcement = `${announcement}${updateText}`.split('\n');
    // Open Stream Writer
    let stream = fs_1.createWriteStream(`./files/command.announcement.txt`, `utf8`);
    // Update Announceent Text File
    stream.write(announcement);
    // Cose Stream Writer
    stream.end();
    log_js_1.debug(`Updating announcement to \n${announcement}`);
    if (!message) { // If No Message Param Provided...
        return;
    }
    else { // If Message Param Provided...
        return message.channel.send(announcement);
    }
}
exports.updateAnnouncement = updateAnnouncement;
/**
 *
 * @param {Discord.Message} [message]
 */
function resetAnnouncement(message) {
    announcement = [];
    let stream = fs_1.createWriteStream(`./files/command.announcement.txt`, `utf8`);
    // Update Announceent Text File
    stream.write(announcement);
    // Cose Stream Writer
    stream.end();
    log_js_1.debug(`Announcement reset!`);
    if (!message) { // If No Message Param Provided...
        return log_js_1.debug(`Announcement reset!`);
    }
    else {
        return message.channel.send(`Announcement reset!`);
    }
}
exports.resetAnnouncement = resetAnnouncement;
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 */
async function run(bot, message) {
    // Debug to Console
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (message.author.id !== userids.ownerID) { // If Not Owner
        return log_js_1.debug(`Attempted use of ${command.fullName} by ${message.author.username}.`);
    }
    // Check if alertMe role is Defined
    if (!alertMe) { // If alertMe Role not Defined...
        let reply = (`No role set for alertMe. Please update files/roles.json`
            + ` and add a role for the "alertMe" entry. For a template, please check `
            + `in the templates directory.`);
        log_js_1.debug(reply);
        return message.channel.send(reply);
    }
    // Check if Announcement Channel is Defined
    if (!announceChat) { // If Announcement Channel Not Defined...
        let reply = (`No channel set for ${command.name} command. Please update `
            + `files/channels.json and add a role for the "announceChat" entry. For a `
            + `tmplate, please check in the templates directory.`);
        log_js_1.debug(reply);
        return message.channel.send(reply);
    }
    // Check if Announcement is Defined
    if (!announcement) { // If Announcement Not Defined...
        let reply = (`No announcement.txt file was able to be located. `
            + `Please ensure that there is a files/announcement.txt file and that it `
            + `is in the right directory.`);
        log_js_1.debug(reply);
        return message.channel.send(reply);
    }
    let announceChannel = bot.channels.get(announceChat);
    announceChannel.send(`<@&${alertMe.ID}>: The bot has recently `
        + `been updated! Below is a list of changes.\n`
        + `If you have any command suggestions, send a DM to <@${userids.ownerID}>.`
        + ` It's easier to keep up with them that way.\n\n`);
    bot.channels.get(command.announceChat).send(command.announcement).catch(error => {
        log_js_1.error(error);
        return message.channel.send(`*${error.toString()}*`);
    });
    return bot.channels.get(command.announceChat).send(`To report bugs, issues, or suggest new features/commands, please use the github repo!\n`
        + `https://github.com/AllusiveBox/discordBot/issues`);
}
exports.run = run;
exports.help = command;
