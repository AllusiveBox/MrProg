"use strict";
/*
    Command Name: stats.js
    Function: Returns a User's Stats
    Clearance: none
    Default Enabled: Yes
    Date Created: 02/27/18
    Last Updated: 10/11/18
    Last Updated By: Th3_M40r

*/
Object.defineProperty(exports, "__esModule", { value: true });
// Load in Required Files
const Discord = require("discord.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const log_js_1 = require("../functions/log.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const config = require("../files/config.json");
const channels = require("../files/channels.json");
// Command Variables
const command = {
    bigDescription: ("This command returns your profile stats!\n"
        + "Returns:\n\t"
        + config.returnsDM),
    description: "Returns your profile stats",
    enabled: true,
    fullName: "Stats",
    name: "stats",
    permissionLevel: "normal"
};
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {betterSql} sql
 */
async function run(bot, message, args, sql) {
    // Debug to Console
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    // Enabled Command Test
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.fullName, message);
    }
    let user = await sql.getUserRow(message.author.id);
    // Get the Server Name
    let serverName = message.member ? message.member.guild.name : "Server";
    // Get the Server Icon
    let serverIcon = ((message.member) && (message.member.guild.iconURL !== null)) ? message.member.guild.iconURL : "https://vignette.wikia.nocookie.net/aura-kingdom/images/1/18/Discord_icon.png/revision/latest?cb=20170108193813";
    // Get the Member's Avatar
    let avatar = "https://vignette.wikia.nocookie.net/aura-kingdom/images/1/18/Discord_icon.png/revision/latest?cb=20170108193813";
    try {
        avatar = message.author.avatarURL.split("?")[0];
    }
    catch (error) {
        log_js_1.error(error);
    }
    // Get the Navi Symbol
    let navi_sym = (`./img/navi_symbols/${user.navi}.png`);
    // Find out How Many Points Until Next Level
    let untilLevel = (Math.floor(((user.level + 1) / (0.142)) * ((user.level + 1) / (0.142))) - user.points);
    // Build the Embed
    let statsEmbed = new Discord.RichEmbed()
        .attachFile({ attachment: navi_sym, name: "navi_sym.png" })
        .setAuthor(`${message.author.username}`, `attachment://navi_sym.png`)
        .setDescription(`${serverName} stats for ${user.userName}`)
        .setColor(config.statsColor)
        .setThumbnail(serverIcon)
        .setImage(avatar)
        .addField("Level", `You are level **${user.level}**`)
        .addField("Points", `You currently have **${user.points}**.\n`
        + `**${untilLevel}** more points are needed to reach the next level.`)
        .addField("Battle Code", user.battlecode)
        .setFooter("MegaMan \u00A9 Capcom Inc.", "https://orig00.deviantart.net/4b65/f/2018/062/a/c/capcom_by_forte_cross_exe-dc4v9vh.jpg");
    if ((message.channel.id === channels.bot) || config.debug) {
        // Return Message in Channel
        message.channel.send(statsEmbed).catch(error => {
            console.log(error);
        });
    }
    else {
        message.author.send(statsEmbed).catch(error => {
            disabledDMs_js_1.run(message, `I am sorry, ${message.author}, I am unable to DM you.\n`
                + `Please check your privacy settings and try again.`);
        });
    }
}
exports.run = run;
exports.help = command;
