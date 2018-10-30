"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("../functions/log");
const roles = require("../files/roles.json");
function run(bot, message, level) {
    log_1.debug(`I am in the changerole function.`);
    let serverRoles = message.guild.roles;
    let member = message.member;
    let has = ` has been promoted to: `;
    if ((!member) || (member === undefined)) {
        log_1.error(`Member object null for ${message.author.username}`);
        return message.channel.send(`${message.author}, I am unable to update your `
            + `roles at this time.`);
    }
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
