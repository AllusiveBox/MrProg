"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const hasElevatedPermissions_js_1 = require("../functions/hasElevatedPermissions.js");
const config = require("../files/config.json");
const roles = require("../files/roles.json");
const adminRole = roles.adminRole;
const modRole = roles.modRole;
const shadowModRole = roles.sModRole;
const command = {
    bigDescription: ("This command is used to promote users, giving them both a role, and updating them in the SQL database.\n"
        + "Required arguments: @{user} -> The user you wish to promote.\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Promote a user.",
    enabled: true,
    fullName: "Promote",
    name: "promote",
    permissionLevel: "admin",
    adminOnly: true
};
async function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} Command.`);
    if (dmCheck_js_1.run(message, command.name))
        return;
    if (!await hasElevatedPermissions_js_1.run(bot, message, command.adminOnly, sql))
        return;
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.name, message);
    }
    let toPromote = message.mentions.members.first();
    if (!toPromote) {
        log_js_1.debug("No member to promote was listed.\n");
        return message.channel.send("Please indicate a valid member to promote.");
    }
    let toLevel = args.slice(1).join(' ');
    if (!toLevel) {
        log_js_1.debug("No level was given to promote to.\n");
        return message.channel.send("Please indicate a valid role to promote to.");
    }
    toLevel = toLevel.toLowerCase();
    if ((toLevel !== "smod") && (toLevel !== "mod") && (toLevel !== "admin") && (toLevel !== "none")) {
        log_js_1.debug(`${message.author.username} tried to promote ${toPromote.user.username} to ${toLevel}, but that level does not exist.`);
        log_js_1.debug(`Only mod or admin are valid.\n`);
        return message.channel.send("Invalid role name. Only mod, sMod, or admin can be declared.");
    }
    let row = await sql.userLookup(toPromote.id);
    if (!row) {
        log_js_1.debug(`${toPromote.user.username} does not exist in database. Unable to promote.`);
        return message.channel.send(`I'm sorry, ${message.author}, I am unable to promote ${toPromote.user.username} `
            + `as they are not currently in the user database.`);
    }
    let serverRoles = message.guild.roles;
    log_js_1.debug(`Setting ${toPromote.user.username} to ${toLevel}.`);
    if (toLevel === "admin") {
        let role = serverRoles.get(adminRole.ID);
        toPromote.addRole(role).catch(error => {
            return log_js_1.error(error);
        });
        sql.promoteUser(toPromote.id, "admin");
        role = serverRoles.get(modRole.ID);
        toPromote.addRole(role)
            .catch(error => {
            log_js_1.debug(`${toPromote.user.username} is not a mod.`);
        });
        role = serverRoles.get(shadowModRole.ID);
        toPromote.addRole(role)
            .catch(error => {
            log_js_1.debug(`${toPromote.user.username} is not a shadow mod.`);
        });
    }
    else if (toLevel === "mod") {
        let role = serverRoles.get(modRole.ID);
        toPromote.addRole(role).catch(error => {
            return log_js_1.error(error);
        });
        sql.promoteUser(toPromote.id, "mod");
        role = serverRoles.get(adminRole.ID);
        toPromote.removeRole(role)
            .catch(error => {
            log_js_1.debug(`${toPromote.user.username} is not an admin.`);
        });
        role = serverRoles.get(shadowModRole.ID);
        toPromote.removeRole(role)
            .catch(error => {
            log_js_1.debug(`${toPromote.user.username} is not a shadow mod.`);
        });
    }
    else if (toLevel === "smod") {
        let role = serverRoles.get(shadowModRole.ID);
        toPromote.addRole(role).catch(error => {
            return log_js_1.error(error);
        });
        sql.promoteUser(toPromote.id, "mod");
        role = serverRoles.get(adminRole.ID);
        toPromote.removeRole(role)
            .catch(error => {
            log_js_1.debug(`${toPromote.user.username} is not an admin.`);
        });
        role = serverRoles.get(modRole.ID);
        toPromote.removeRole(role)
            .catch(error => {
            log_js_1.debug(`${toPromote.user.username} is not a mod.`);
        });
    }
    else {
        let role = serverRoles.get(adminRole.ID);
        toPromote.removeRole(role).catch(error => {
            log_js_1.debug(`${toPromote.user.username} is not an admin.`);
        });
        sql.promoteUser(toPromote.id, "none");
        role = serverRoles.get(modRole.ID);
        toPromote.removeRole(role)
            .catch(error => {
            log_js_1.debug(`${toPromote.user.username} is not a mod.`);
        });
        role = serverRoles.get(shadowModRole.ID);
        toPromote.removeRole(role)
            .catch(error => {
            log_js_1.debug(`${toPromote.user.username} is not a shadow mod.`);
        });
    }
    return message.channel.send(`${toPromote} has been promoted to **${toLevel}**.\n`);
}
exports.run = run;
exports.help = command;
