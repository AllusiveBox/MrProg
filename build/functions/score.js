"use strict";
/**

    cxBot.js Mr. Prog Score Script
    Version: 3
    Author: AllusiveBox
    Date Started: 08/11/18
    Date Last Updated: 10/10/18
    Last Update By: Th3_M4j0r

**/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("./log.js");
const changeRole_js_1 = require("./changeRole.js");
const config = require("../files/config.json");
/**
 *
 * Score throttling
 *
 * @type {Set<Discord.Snowflake>}
 */
const talkedRecently = new Set();
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {betterSql} sql
 */
async function run(bot, message, sql) {
    // Debug to Console
    log_js_1.debug(`I am inside the Score System`);
    if (!config.score)
        return log_js_1.debug(`Score System Disabled.`);
    if (talkedRecently.has(message.author.id))
        return log_js_1.debug(`Throttled `
            + `${message.author.username}.`);
    talkedRecently.add(message.author.id);
    setTimeout(() => {
        // Remove User from Set after 30 Seconds
        talkedRecently.delete(message.author.id);
    }, 30000);
    // Begin Score System
    try {
        //while(!sql._dbOpen) {} //wait for the db to be open
        let row = await sql.getUserRow(message.author.id);
        if (!row) { // If Row Not Found...
            log_js_1.debug(`Row was not found for ${message.author.username}. `
                + `Generating data now...`);
            sql.insertUser(message.author.id, message.author.username);
        }
        else { // If Row Was Found...
            if (row.optOut === 1) {
                log_js_1.debug(`User does not want data collected.`);
                return;
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
            // Increase Points by 1
            let curLevel = Math.floor(0.142 * Math.sqrt(row.points + 1));
            log_js_1.debug(`Checking if Leveled Up.`);
            if (curLevel > row.level) { // If Current Level > Actual Level...
                row.level = curLevel;
                log_js_1.debug(`${message.author.username} has leveled up. Generating `
                    + `level up message.`);
                message.channel.send(`Congratulations, ${name}, you've just reached `
                    + `level **${curLevel}**!`);
                // TODO When finished, Enable changeRole call here
                changeRole_js_1.run(bot, message, curLevel);
            }
            log_js_1.debug(`Updating userinfo file.`);
            sql.setPoints(message.author.id, row.points + 1, row.level, name);
        }
    }
    catch (error) {
        await sql.run("CREATE TABLE IF NOT EXISTS userinfo (userId TEXT NOT NULL, "
            + "userName TEXT, battlecode TEXT, favechip TEXT, navi TEXT, "
            + "clearance TEXT, points INTEGER, level INTEGER, optOut INTEGER, "
            + "PRIMARY KEY (userId))");
        message.channel.send(`ERROR CAUSED BY: ${message.author}.`);
        return log_js_1.error(error);
    }
}
exports.run = run;
