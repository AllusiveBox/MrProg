/**

    cxBot.js Mr. Prog Role Changing Script
    Version: 3
    Author: AllusiveBox
    Date Started: 08/11/18
    Date Last Updated: 10/27/18
    Last Update By: AllusiveBox

**/

// Load in Required Libraries and Files
const Discord = require(`discord.js`);
const roles = require(`../files/roles.json`);
const { debug, error: errorLog } = require(`../functions/log.js`);

/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {Number} level
 */
module.exports.run = async (bot, message, level) => {
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
    let role = serverRoles.get(roles.levelUp[level].ID);
    if (role === undefined || role === null) {
        return debug(`Role has not been defined for level ${level}...`);
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
