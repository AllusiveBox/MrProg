"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const log_js_1 = require("./log.js");
const config = require("../files/config.json");
const roles = require("../files/roles.json");
const userids = require("../files/userids.json");
function isServerCommand(bot, message, adminOnly) {
    let allowedRoles = Array(roles.adminRole.ID);
    if (!adminOnly) {
        allowedRoles.push(roles.modRole.ID);
        allowedRoles.push(roles.sModRole.ID);
    }
    return message.member.roles.some(r => allowedRoles.includes(r.id));
}
async function isDMedCommand(bot, message, adminOnly, sql) {
    if (!sql) {
        throw new Error("sql cannot be null for commands that could be used in a DM");
    }
    let row = await sql.getUserRow(message.author.id);
    if (!row) {
        log_js_1.debug(`${message.author.username} does not exist in the `
            + `database.`);
        return false;
    }
    else {
        if (adminOnly) {
            return row.clearance === "admin";
        }
        else {
            switch (row.clearance) {
                case "admin":
                case "mod":
                case "smod":
                    return true;
                default:
                    return false;
            }
        }
    }
}
async function run(bot, message, adminOnly = false, sql, quiet = false) {
    log_js_1.debug(`I am in the hasElevatedPermissions function`);
    let DMedCommand = (dmCheck_js_1.check(message, "elevatedPermissionsCheck"));
    if (DMedCommand && sql == null) {
        throw new Error("sql was not provided for a DMed command");
    }
    let hasPermission = false;
    if (!DMedCommand) {
        hasPermission = isServerCommand(bot, message, adminOnly);
    }
    else {
        hasPermission = await isDMedCommand(bot, message, adminOnly, sql);
    }
    if (message.author.id === userids.ownerID) {
        hasPermission = true;
    }
    if (!(hasPermission) && !(quiet)) {
        message.author.send(config.invalidPermission).catch(error => {
            disabledDMs_js_1.run(message, config.invalidPermission);
        });
    }
    return hasPermission;
}
exports.run = run;
