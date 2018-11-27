"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const log_js_1 = require("../functions/log.js");
const hasElevatedPermissions_js_1 = require("../functions/hasElevatedPermissions.js");
const react_js_1 = require("../functions/react.js");
const userIDs = require("../files/userids.json");
const command = {
    fullName: "Lookup",
    name: "lookup",
    adminOnly: false,
    bigDescription: ("Looks up and returns a particular user's data, "
        + "formats it using any given format flags.\n"
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
            let reply = `SQL Data on: ${toCheck}\n`;
            if (formattedMessage) {
                if (includeAll || includeUserID) {
                    reply = `${reply}Discord User ID:\n\t ${row.userId}\n`;
                }
                if (includeAll || includeUserName) {
                    reply = `${reply}Current Server Username:\n\t ${row.userName}\n`;
                }
                if (includeAll || includeBattlecode) {
                    reply = `${reply}Current Battlecode:\n\t ${row.battlecode}\n`;
                }
                if (includeAll || includeFavChip) {
                    reply = `${reply}Current Favorite Chip:\n\t ${row.favechip}\n`;
                }
                if (includeAll || includeNaviSym) {
                    reply = `${reply}Current Navi Symbol:\n\t ${row.navi}\n`;
                }
                if (includeAll || includeClearance) {
                    reply = `${reply}Current Clearance:\n\t ${row.clearance}\n`;
                }
                if (includeAll || includePoints) {
                    reply = `${reply}Current Points:\n\t ${row.points}\n`;
                }
                if (includeAll || includeLevel) {
                    reply = `${reply}Current Level:\n\t ${row.level}`;
                }
                reply = "```" + reply + "```";
            }
            else {
                if (includeAll || includeUserID) {
                    reply = `${reply} ${row.userId};`;
                }
                if (includeAll || includeUserName) {
                    reply = `${reply} ${row.userName};`;
                }
                if (includeAll || includeBattlecode) {
                    reply = `${reply} ${row.battlecode};`;
                }
                if (includeAll || includeFavChip) {
                    reply = `${reply} ${row.favechip};`;
                }
                if (includeAll || includeNaviSym) {
                    reply = `${reply} ${row.navi};`;
                }
                if (includeAll || includeClearance) {
                    reply = `${reply} ${row.clearance};`;
                }
                if (includeAll || includePoints) {
                    reply = `${reply} ${row.points};`;
                }
                if (includeAll || includeLevel) {
                    reply = `${reply} ${row.level};`;
                }
            }
            if (publicMessage) {
                await react_js_1.run(message);
                return message.channel.send(reply);
            }
            else {
                return message.author.send(reply).then(function () {
                    return react_js_1.run(message);
                }).catch(error => {
                    disabledDMs_js_1.run(message, `I am sorry, ${message.author}, I am unable to DM you.\n`
                        + `Please check your privacy settings and try again.`);
                    return react_js_1.run(message, false);
                });
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
