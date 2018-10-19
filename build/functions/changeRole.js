"use strict";
/**

    cxBot.js Mr. Prog Role Changing Script
    Version: 3
    Author: AllusiveBox
    Date Started: 08/11/18
    Date Last Updated: 10/13/18
    Last Update By: AllusiveBox

**/
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("../functions/log");
const roles = require("../files/roles.json");
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {Number} level
 */
function run(bot, message, level) {
    // Debug to Console
    log_1.debug(`I am in the changerole function.`);
    // Default Assignments
    let serverRoles = message.guild.roles;
    let member = message.member;
    let has = ` has been promoted to: `;
    if ((!member) || (member === undefined)) { // If Member Object is null...
        log_1.error(`Member object null for ${message.author.username}`);
        return message.channel.send(`${message.author}, I am unable to update your `
            + `roles at this time.`);
    }
    // Get The Role
    let role = serverRoles.get(roles.levelUp[`${level}`]);
    if (!role) {
        return log_1.debug(`Role has not been defined for level ${level}...`);
    }
    else {
        role = role.id;
    }
    member.addRole(role).catch(error => {
        return log_1.error(error);
    });
    log_1.debug(`${message.author.username}${has}${roles.levelUp[`${level}`].name}`);
    message.channel.send(`You have been promoted to `
        + `**__${roles.levelUp[`${level}`].name}!__**`);
}
exports.run = run;
