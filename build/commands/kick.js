"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const hasElevatedPermissions_js_1 = require("../functions/hasElevatedPermissions.js");
const kick_js_1 = require("../functions/kick.js");
const react_js_1 = require("../functions/react.js");
const roles = require("../files/roles.json");
const userids = require("../files/userids.json");
const adminRole = roles.adminRole;
const modRole = roles.modRole;
const shadowModRole = roles.sModRole;
const command = {
    adminOnly: false,
    adminRole: roles.adminRole,
    modRole: roles.modRole,
    shadowModRole: roles.sModRole,
    bigDescription: ("Use this command to kick someone from a server \n"
        + "Arguments:\n\t"
        + "@{user} -> The user to ban.\n\t"
        + "{string} -> The reason the member is to be kicked.\n"
        + "Returns:\n\t"
        + "On successful kick, a message will be logged."),
    description: "Kick a user form the server",
    enabled: null,
    fullName: "Kick",
    name: "kick",
    permissionLevel: "mod"
};
async function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (dmCheck_js_1.run(message, command.fullName))
        return;
    if (!await hasElevatedPermissions_js_1.run(bot, message, command.adminOnly, sql))
        return;
    var toKick = message.mentions.members.first();
    if (!toKick) {
        log_js_1.debug(`A valid member of the server was not provided.`);
        let reply = (`Please mention a valid member on the server, `
            + `${message.author}.`);
        await react_js_1.run(message, false);
        return message.author.send(reply).catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
    }
    if (toKick.user.id == userids.ownerID) {
        await react_js_1.run(message, false);
        return log_js_1.debug(`${message.author.username} attempted to kick owner.`);
    }
    else if (toKick.roles.some(r => [command.adminRole.ID, command.modRole.ID,
        command.shadowModRole.ID].includes(r.id))) {
        log_js_1.debug(`${message.author.username} attempted to kick `
            + `${toKick.user.username}.`);
        await react_js_1.run(message, false);
        return message.channel.send(`I am sorry, ${message.author}, I am `
            + `unable to kick ${toKick.user.username} due to the role(s) `
            + `they have.`);
    }
    var reason = args.slice(1).join(" ");
    if (!reason) {
        log_js_1.debug(`No valid reason was provided.`);
        let reply = (`Please indicate a valid reason for kicking `
            + `${toKick.user.username}.`);
        await react_js_1.run(message, false);
        return message.author.send(reply).catch(error => {
            log_js_1.debug(`${message.author.username} has DMs disabled.`);
            disabledDMs_js_1.run(message, reply);
        });
    }
    await log_js_1.debug("setting kick flag to true");
    bot.isKicking = true;
    kick_js_1.run(bot, message, toKick, reason, sql);
}
exports.run = run;
exports.help = command;
