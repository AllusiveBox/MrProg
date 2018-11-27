"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dmCheck_js_1 = require("../functions/dmCheck.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const deleteMemberInfo_js_1 = require("../functions/deleteMemberInfo.js");
const log_js_1 = require("../functions/log.js");
const react_js_1 = require("../functions/react.js");
const config = require("../files/config.json");
const userids = require("../files/userids.json");
const commandUsed = new Set();
const command = {
    bigDescription: ("Deletes the user's data from the user database."
        + "Returns\n\t"
        + config.returnsDM),
    description: "Deletes user's data from the user database.",
    enabled: null,
    fullName: "Delete Me",
    name: "deleteme",
    permissionLevel: "normal"
};
async function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (await dmCheck_js_1.run(message, command.fullName))
        return;
    let row = await sql.getUserRow(message.author.id);
    if (!row) {
        let reply = (`I am unable to locate any data on you.\n`
            + `Please either try again, or alert <@${userids.ownerID}>.`);
        await react_js_1.run(message, false);
        return message.author.send(reply)
            .catch(error => {
            log_js_1.error(error);
            return disabledDMs_js_1.run(message, reply);
        });
    }
    if (!commandUsed.has(message.author.id)) {
        let reply = (`**__WARNING!!!__**\n\n`
            + `Using the ${config.prefix}deleteMe command deletes ***all*** of `
            + `your non-public data stored in the user information database.\n\n`
            + `**__This action cannot be undone.__**\n\n`
            + `If you are sure you want to delete this data, use this command `
            + `again.`);
        message.author.send(reply).catch(error => {
            log_js_1.error(error);
            disabledDMs_js_1.run(message, reply);
        });
        commandUsed.add(message.author.id);
        setTimeout(() => {
            commandUsed.delete(message.author.id);
        }, 60000);
        return;
    }
    let hasClearance = !(row.clearance == null || row.clearance === "none");
    if (row.optOut === 1) {
        log_js_1.debug(`${message.author.username} does not wish for data to be `
            + `collected on them. Preserving this preference.`);
        await sql.deleteUser(message.author.id);
        let reply = (`Data on you has been deleted, ${message.author}. Your `
            + `preference to have your data collection prevented has been `
            + `preserved, however.`);
        if (hasClearance) {
            reply = (`Data on you has been deleted, ${message.author}. Your `
                + `clearance and preference to have your data collection prevented has been `
                + `preserved, however.`);
        }
        await react_js_1.run(message);
        return message.author.send(reply).catch(error => {
            log_js_1.error(error);
            return disabledDMs_js_1.run(message, reply);
        });
    }
    else if (hasClearance) {
        await sql.deleteUser(message.author.id);
        await react_js_1.run(message);
        let reply = (`Data on you has been deleted, ${message.author}. Your `
            + `clearance and preference to have your data collection prevented has been `
            + `preserved, however.`);
        return message.author.send(reply).catch(error => {
            log_js_1.error(error);
            return disabledDMs_js_1.run(message, reply);
        });
    }
    else {
        deleteMemberInfo_js_1.run(bot, message.member, sql).catch(error => {
            log_js_1.error(error);
            react_js_1.run(message, false);
            return message.channel.send(`*${error.toString()}*`);
        });
        await react_js_1.run(message);
        let reply = (`Data on you has been deleted, ${message.author}.`);
        if (hasClearance) {
            reply = (`Data on you has been deleted, ${message.author}. `
                + `However, your clearance has been preserved`);
        }
        return message.author.send(reply).catch(error => {
            log_js_1.error(error);
            return disabledDMs_js_1.run(message, reply);
        });
    }
}
exports.run = run;
exports.help = command;
