/**

    cxBot.js Mr. Prog Delete Member Data Scripts
    Version: 3
    Author: AllusiveBox
    Date Started: 02/28/18
    Date Last Updated: 11/24/18
    Last Update By: AllusiveBox
**/

// Load in Required Libraries and Files
import * as Discord from 'discord.js';
import { debug, error as errorLog } from './log.js';
import betterSql from '../classes/betterSql.js';

import userids = require('../files/userids.json');


/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.GuildMember} member
 * @param {betterSql} sql
 */
export async function run(bot: Discord.Client, member: Discord.GuildMember, sql: betterSql) {
    // Debug to Console
    debug(`I am in the deleteMemberInfo function.`);

    // Check if Member is in User ID List
    Object.keys(userids).forEach(function (key) {
        if (userids[key] === member.id) { // If Member is in User ID List...
            return debug(`Preserving data on ${member.user.username} due to being in `
                + `the userids list.`);
        }
    });

    // Delete User Information on Member
    debug(`Setting the User's leaveDate Field...`);
    sql.userLeft(member.id);
    return debug(`Update Successful.`);
}
