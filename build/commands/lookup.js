"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const log_js_1 = require("../functions/log.js");
const hasElevatedPermissions_js_1 = require("../functions/hasElevatedPermissions.js");
const react_js_1 = require("../functions/react.js");
const config = require("../files/config.json");
const userIDs = require("../files/userids.json");
const command = {
    fullName: "Lookup",
    name: "lookup",
    adminOnly: false,
    bigDescription: ("Looks up and returns a particular user's data, "
        + "formats it using any given format flags.\n"
        + "Arguments: (first argument begins with a dash '-' character)\n"
        + "\t F => Formats the reply as an embed\n"
        + "\t P => Makes the reply a public message\n"
        + "\t A => The reply will include **all** userinfo data\n"
        + "\t i => Includes the User's ID\n"
        + "\t n => Includes the User's Nickname\n"
        + "\t b => Includes the User's Battlecode\n"
        + "\t f => Includes the User's Favorite Chip\n"
        + "\t s => Includes the User's Navi Symbol\n"
        + "\t c => Includes the User's Clearance Level\n"
        + "\t p => Includes the User's Points\n"
        + "\t l => Includes the User's Level\n"
        + "\t o => Includes the User's OptOut Settings\n"
        + "\t j => Includes the User's Join Date\n"
        + "\t b => Includes the User's Leave Date\n"
        + "\t g => Includes the User's First Join Date\n"
        + "Returns:\n\t"
        + "DM reply unless public flag is set"),
    description: "looks for a particular user in the database",
    enabled: null,
    permissionLevel: "mod"
};
async function run(client, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.name} Command.`);
    let params = "";
    let formattedMessage = false;
    let publicMessage = false;
    let multipleUsers = false;
    let includeAll = false;
    let includeUserID = false;
    let includeUserName = false;
    let includeBattlecode = false;
    let includeFavChip = false;
    let includeNaviSym = false;
    let includeClearance = false;
    let includePoints = false;
    let includeLevel = false;
    let includeOptIn = false;
    let includeJoinDate = false;
    let includeLeaveDate = false;
    let includeFirstJoinDate = false;
    if (!await hasElevatedPermissions_js_1.run(client, message, command.adminOnly, sql))
        return;
    if (args[0] !== undefined) {
        params = args[0];
    }
    if ((params.indexOf('-')) || (params.length === 0) || (args[1] === undefined)) {
        await react_js_1.run(message, false);
        let reply = (`Either no params were passed, or you did not format your params correctly.`);
        return message.author.send(reply).catch(error => {
            log_js_1.error(error);
            return disabledDMs_js_1.run(message, reply);
        });
    }
    if (params.includes('F')) {
        log_js_1.debug(`Setting Formatted Message Flag.`);
        formattedMessage = true;
    }
    if (params.includes('P')) {
        log_js_1.debug(`Setting Public Message Flag.`);
        publicMessage = true;
    }
    if (params.includes('M')) {
        log_js_1.debug(`Setting Mutliple Users Flag.`);
        multipleUsers = true;
    }
    if (params.includes('A')) {
        log_js_1.debug(`Setting Include All Data Flag.`);
        includeAll = true;
    }
    else {
        if (params.includes('i')) {
            log_js_1.debug(`Setting Include UserID Flag.`);
            includeUserID = true;
        }
        if (params.includes('n')) {
            log_js_1.debug(`Setting Include Username Flag.`);
            includeUserName = true;
        }
        if (params.includes('b')) {
            log_js_1.debug(`Setting Include Battle Code Flag.`);
            includeBattlecode = true;
        }
        if (params.includes('f')) {
            log_js_1.debug(`Setting Include FavChip Flag.`);
            includeFavChip = true;
        }
        if (params.includes('s')) {
            log_js_1.debug(`Setting Include Navi Symbol Flag.`);
            includeNaviSym = true;
        }
        if (params.includes('c')) {
            log_js_1.debug(`Setting Include Clearance Level Flag.`);
            includeClearance = true;
        }
        if (params.includes('p')) {
            log_js_1.debug(`Setting Include Points Flag.`);
            includePoints = true;
        }
        if (params.includes('l')) {
            log_js_1.debug(`Setting Include Level Flag.`);
            includeLevel = true;
        }
        if (params.includes('o')) {
            log_js_1.debug(`Setting Include Opt In Flag.`);
            includeOptIn = true;
        }
        if (params.includes('j')) {
            log_js_1.debug(`Setting Join Date Flag.`);
            includeJoinDate = true;
        }
        if (params.includes('b')) {
            log_js_1.debug(`Setting Leave Date Flag.`);
            includeLeaveDate = true;
        }
        if (params.includes('g')) {
            log_js_1.debug(`Setting First Join Date Flag.`);
            includeFirstJoinDate = true;
        }
    }
    let toCheck = '';
    if (message.channel.type !== 'dm') {
        toCheck = message.mentions.members.first();
    }
    if (!toCheck) {
        toCheck = args.slice(1).join(' ');
    }
    try {
        let row = await sql.userLookup(toCheck);
        if (!row) {
            await react_js_1.run(message, false);
            let reply = (`I am sorry, ${message.author}, I am unable to locate any data on ${toCheck}.\n`
                + `Please verify that what you are searching by is correct and try again. If this issue continues, please reach out to `
                + `<@${userIDs.ownerID}> and let him know.`);
            return message.channel.send(reply).catch(error => {
                log_js_1.error(error);
                return disabledDMs_js_1.run(message, reply);
            });
        }
        else {
            let reply = `SQL Data on: ${row.userName}\n`;
            let lookupColor = config.logChannelColors.memberLookup;
            let userEmbed = new Discord.RichEmbed()
                .setDescription(`Data on ${toCheck}`)
                .setColor(lookupColor);
            if (includeAll || includeUserID) {
                reply = `${reply}Discord User ID:\n\t ${row.userId}\n\n`;
                userEmbed.addField("User ID", row.userId);
            }
            if (includeAll || includeUserName) {
                reply = `${reply}Current Server Username:\n\t ${row.userName}\n\n`;
                userEmbed.addField("Nickname", row.userName);
            }
            if (includeAll || includeBattlecode) {
                reply = `${reply}Current Battlecode:\n\t ${row.battlecode}\n\n`;
                userEmbed.addField("Battlecode", row.battlecode);
            }
            if (includeAll || includeFavChip) {
                reply = `${reply}Current Favorite Chip:\n\t ${row.favechip}\n\n`;
                userEmbed.addField("Favorite Chip", row.favechip);
            }
            if (includeAll || includeNaviSym) {
                reply = `${reply}Current Navi Symbol:\n\t ${row.navi}\n\n`;
                userEmbed.addField("Navi Symbol", row.navi);
            }
            if (includeAll || includeClearance) {
                reply = `${reply}Current Clearance:\n\t ${row.clearance}\n\n`;
                userEmbed.addField("Clearance", row.clearance);
            }
            if (includeAll || includePoints) {
                reply = `${reply}Current Points:\n\t ${row.points}\n\n`;
                userEmbed.addField("Points", row.points);
            }
            if (includeAll || includeLevel) {
                reply = `${reply}Current Level:\n\t ${row.level}\n\n`;
                userEmbed.addField("Level", row.level);
            }
            if (includeAll || includeOptIn) {
                reply += `Current OptIn Status:\n\t ${row.optOut}\n\n`;
                userEmbed.addField("OptOut Status", row.optOut === 1 ? "Yes" : "No");
            }
            if (includeAll || includeJoinDate) {
                reply += `User Server Join Date:\n\t ${row.joinDate !== null ? new Date(row.joinDate) : "N/A"}\n\n`;
                userEmbed.addField("Server Join Date", row.joinDate !== null ? new Date(row.joinDate) : "Not in Server");
            }
            if (includeAll || includeLeaveDate) {
                reply += `User Last Leave Date:\n\t ${row.leaveDate !== null ? new Date(row.leaveDate) : "N/A"}\n\n`;
                userEmbed.addField("Date Left", row.leaveDate !== null ? new Date(row.leaveDate) : "N/A");
            }
            if (includeAll || includeFirstJoinDate) {
                reply += `User Original Join Date:\n\t ${new Date(row.firstJoinDate)}\n\n`;
                userEmbed.addField("Original Join Date", new Date(row.firstJoinDate));
            }
            reply = "```" + reply + "```";
            if (publicMessage) {
                if (formattedMessage) {
                    try {
                        message.channel.send(userEmbed);
                        return react_js_1.run(message);
                    }
                    catch (error) {
                        await react_js_1.run(message, false);
                        return message.channel.send(`I am sorry, ${message.author}, something went wrong!`
                            + `Error: *${error.toString()}*`);
                    }
                }
                else {
                    try {
                        message.channel.send(reply);
                        return react_js_1.run(message);
                    }
                    catch (error) {
                        await react_js_1.run(message, false);
                        return message.channel.send(`I am sorry, ${message.author}, something went wrong!`
                            + `Error: *${error.toString()}*`);
                    }
                }
            }
            else {
                if (formattedMessage) {
                    try {
                        message.author.send(userEmbed);
                        return react_js_1.run(message);
                    }
                    catch (error) {
                        await react_js_1.run(message, false);
                        return message.channel.send(`I am sorry, ${message.author}, something went wrong!`
                            + `Error: *${error.toString()}*`);
                    }
                }
                else {
                    try {
                        message.author.send(reply);
                        return react_js_1.run(message);
                    }
                    catch (error) {
                        await react_js_1.run(message, false);
                        return message.channel.send(`I am sorry, ${message.author}, something went wrong!`
                            + `Error: *${error.toString()}*`);
                    }
                }
            }
        }
    }
    catch (error) {
        log_js_1.error(error);
        await react_js_1.run(message, false);
        message.channel.send(`*${error.toString()}*`);
    }
}
exports.run = run;
exports.help = command;
