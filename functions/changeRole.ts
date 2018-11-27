/**

    cxBot.js Mr. Prog Role Changing Script
    Version: 3
    Author: AllusiveBox
    Date Started: 08/11/18
    Date Last Updated: 11/18/18
    Last Update By: AllusiveBox

**/

// Load in Required Libraries and Files
import * as Discord from 'discord.js';
import { debug, error as errorLog } from '../functions/log';

import roles = require('../files/roles.json');


/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {Number} level
 */
export async function run(bot: Discord.Client, message: Discord.Message, level: number) {
    // Debug to Console
    debug(`I am in the changerole function.`);

    // Default Assignments
    let serverRoles = message.guild.roles;
    let member = message.member;
    let has = ` has been promoted to: `;

    if ((!member) || (member === undefined)) { // If Member Object is null...
        errorLog(`Member object null for ${message.author.username}`);
        return message.channel.send(`${message.author}, I am unable to update your `
            + `roles at this time.`);
    }

    // Get The Role
    let role: Discord.RoleResolvable = "";
    if ((roles.levelUp[level] === null) || (roles.levelUp[level] === undefined)) {
        return debug(`Role has not been defined for level ${level}...`);
    } else if (roles.levelUp[level].ID === "") { // If ID Does not Exist...
        return debug(`Unable to locate ID for level ${level}...`);
    } else {
        role = serverRoles.get(roles.levelUp[level].ID);
    }

    try {
        await member.addRole(role);
    } catch (error) {
        errorLog(error);
        return message.channel.send(`*${error.toString()}*`);
    }

    debug(`${message.author.username}${has}${roles.levelUp[level].name}`);
    message.channel.send(`You have been promoted to `
        + `**__${roles.levelUp[level].name}!__**`);
    if (roles.levelUp[level].img) {
        message.channel.send({ file: `./img/license/${roles.levelUp[level].img}` });
    }
}
