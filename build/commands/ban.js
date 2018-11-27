"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ban_js_1 = require("../functions/ban.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const hasElevatedPermissions_js_1 = require("../functions/hasElevatedPermissions.js");
const log_js_1 = require("../functions/log.js");
const react_js_1 = require("../functions/react.js");
const roles = require("../files/roles.json");
const userids = require("../files/userids.json");
const command = {
    adminOnly: false,
    bigDescription: ("Use this command to ban someone from a server \n"
        + "Arguments:\n\t"
        + "@{user} -> The user to ban.\n\t"
        + "{string} -> The reason the member is to be banned.\n"
        + "Returns:\n\t"
        + "On successful ban, a message will be logged."),
    description: "Ban someone from a server",
    enabled: null,
    fullName: "Ban",
    name: "ban",
    permissionLevel: "mod"
};
async function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (dmCheck_js_1.run(message, command.fullName))
        return;
    if (!await hasElevatedPermissions_js_1.run(bot, message, command.adminOnly, sql))
        return;
    var toBan = message.mentions.members.first();
    if (!toBan) {
        log_js_1.debug(`A valid member of the server was not provided.`);
        let reply = (`Please mention a valid member on the server, `
            + `${message.author}.`);
        await react_js_1.run(message, false);
        return message.author.send(reply).catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
    }
    if (toBan.user.id == userids.ownerID) {
        await react_js_1.run(message, false);
        return log_js_1.debug(`${message.author.username} attempted to ban owner.`);
    }
    else if (toBan.roles.some(r => [roles.adminRole.ID, roles.modRole.ID,
        roles.sModRole.ID].includes(r.id))) {
        log_js_1.debug(`${message.author.username} attempted to ban `
            + `${toBan.user.username}.`);
        await react_js_1.run(message, false);
        return message.channel.send(`I am sorry, ${message.author}, I am `
            + `unable to ban ${toBan.user.username} due to the role(s) `
            + `they have.`);
    }
    var reason = args.slice(1).join(" ");
    if (!reason) {
        log_js_1.debug(`No valid reason was provided.`);
        let reply = (`Please indicate a valid reason for banning `
            + `${toBan.user.username}.`);
        await react_js_1.run(message, false);
        return message.author.send(reply).catch(error => {
            log_js_1.debug(`${message.author.username} has DMs disabled.`);
            disabledDMs_js_1.run(message, reply);
        });
    }
    bot.isKicking = true;
    ban_js_1.run(bot, message, toBan, reason, sql);
}
exports.run = run;
exports.help = command;
