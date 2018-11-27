"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("./log.js");
const changeRole_js_1 = require("./changeRole.js");
const config = require("../files/config.json");
const talkedRecently = new Set();
async function run(bot, message, sql) {
    log_js_1.debug(`I am inside the Score System`);
    if (!config.score)
        return log_js_1.debug(`Score System Disabled.`);
    if (talkedRecently.has(message.author.id))
        return log_js_1.debug(`Throttled `
            + `${message.author.username}.`);
    talkedRecently.add(message.author.id);
    setTimeout(() => {
        talkedRecently.delete(message.author.id);
    }, 30000);
    try {
        let row = await sql.getUserRow(message.author.id);
        if (!row) {
            log_js_1.debug(`Row was not found for ${message.author.username}. `
                + `Generating data now...`);
            sql.insertUser(message.author.id, message.author.username, message.member.joinedAt);
        }
        else {
            if (row.joinDate === null) {
                sql.setJoinDate(message.author.id, message.member.joinedAt);
            }
            if (row.firstJoinDate === null) {
                sql.setFirstJoinDate(message.author.id, message.member.joinedAt);
            }
            if (row.optOut === 1) {
                return log_js_1.debug(`User does not want data collected.`);
            }
            log_js_1.debug(`Row found for ${message.author.username}.`);
            let name = message.author.username;
            try {
                name = message.guild.members.get(message.author.id).nickname;
                if (!name)
                    name = message.author.username;
                log_js_1.debug(`Name set to: ${name}`);
            }
            catch (error) {
                name = message.author.username;
                log_js_1.debug(`Unable to get Nickname. Name set to: ${name}`);
            }
            let curLevel = Math.floor(0.142 * Math.sqrt(row.points + 1));
            log_js_1.debug(`Checking if Leveled Up.`);
            if (curLevel > row.level) {
                row.level = curLevel;
                log_js_1.debug(`${message.author.username} has leveled up. Generating `
                    + `level up message.`);
                message.channel.send(`Congratulations, ${name}, you've just reached `
                    + `level **${curLevel}**!`);
                await changeRole_js_1.run(bot, message, curLevel);
            }
            log_js_1.debug(`Updating userinfo file.`);
            sql.setPoints(message.author.id, row.points + 1, row.level, name);
        }
    }
    catch (error) {
        message.channel.send(`ERROR CAUSED BY: ${message.author}.`
            + `Error: *${error.toString()}*`);
        return log_js_1.error(error);
    }
}
exports.run = run;
