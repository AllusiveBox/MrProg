"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("../functions/log");
const roles = require("../files/roles.json");
async function run(bot, message, level) {
    log_1.debug(`I am in the changerole function.`);
    let serverRoles = message.guild.roles;
    let member = message.member;
    let has = ` has been promoted to: `;
    if ((!member) || (member === undefined)) {
        log_1.error(`Member object null for ${message.author.username}`);
        return message.channel.send(`${message.author}, I am unable to update your `
            + `roles at this time.`);
    }
    let role = "";
    if ((roles.levelUp[level] === null) || (roles.levelUp[level] === undefined)) {
        return log_1.debug(`Role has not been defined for level ${level}...`);
    }
    else if (roles.levelUp[level].ID === "") {
        return log_1.debug(`Unable to locate ID for level ${level}...`);
    }
    else {
        role = serverRoles.get(roles.levelUp[level].ID);
    }
    try {
        await member.addRole(role);
    }
    catch (error) {
        log_1.error(error);
        return message.channel.send(`*${error.toString()}*`);
    }
    log_1.debug(`${message.author.username}${has}${roles.levelUp[level].name}`);
    message.channel.send(`You have been promoted to `
        + `**__${roles.levelUp[level].name}!__**`);
    if (roles.levelUp[level].img) {
        message.channel.send({ file: `./img/license/${roles.levelUp[level].img}` });
    }
}
exports.run = run;
