"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const log_js_1 = require("../functions/log.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const react_js_1 = require("../functions/react.js");
const config = require("../files/config.json");
const channels = require("../files/channels.json");
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
async function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.fullName, message);
    }
    let user = await sql.getUserRow(message.author.id);
    let serverName = message.member ? message.member.guild.name : "Server";
    let serverIcon = ((message.member) && (message.member.guild.iconURL !== null)) ? message.member.guild.iconURL : "https://vignette.wikia.nocookie.net/aura-kingdom/images/1/18/Discord_icon.png/revision/latest?cb=20170108193813";
    let avatar = "https://vignette.wikia.nocookie.net/aura-kingdom/images/1/18/Discord_icon.png/revision/latest?cb=20170108193813";
    try {
        avatar = message.author.avatarURL.split("?")[0];
    }
    catch (error) {
        log_js_1.error(error);
    }
    let navi_sym = (`./img/navi_symbols/${user.navi}.png`);
    let untilLevel = (Math.floor(((user.level + 1) / (0.142)) * ((user.level + 1) / (0.142))) - user.points);
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
        return message.channel.send(statsEmbed).then(function () {
            return react_js_1.run(message);
        }).catch(error => {
            log_js_1.error(error);
            return react_js_1.run(message, false);
        });
    }
    else {
        return message.author.send(statsEmbed).then(function () {
            return react_js_1.run(message);
        }).catch(error => {
            disabledDMs_js_1.run(message, `I am sorry, ${message.author}, I am unable to DM you.\n`
                + `Please check your privacy settings and try again.`);
            return react_js_1.run(message, false);
        });
    }
}
exports.run = run;
exports.help = command;
