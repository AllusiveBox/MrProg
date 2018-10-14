"use strict";
/**

    cxBot.js Mr. Prog Delete Member Data Scripts
    Version: 3
    Author: AllusiveBox
    Date Started: 02/28/18
    Date Last Updated: 10/13/18
    Last Update By: AllusiveBox
**/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("./log.js");
const userids = require("../files/userids.json");
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.GuildMember} member
 * @param {betterSql} sql
 */
async function run(bot, member, sql) {
    // Debug to Console
    log_js_1.debug(`I am in the deleteMemberInfo function.`);
    // Check if Member is in User ID List
    Object.keys(userids).forEach(function (key) {
        if (userids[key] === member.id) { // If Member is in User ID List...
            return log_js_1.debug(`Preserving data on ${member.user.username} due to being in `
                + `the userids list.`);
        }
    });
    // Delete User Information on Member
    log_js_1.debug(`Deleting userinfo on ${member.user.username}.`);
    sql.userLeft(member.id);
    return log_js_1.debug(`Delete Successful.`);
}
exports.run = run;
