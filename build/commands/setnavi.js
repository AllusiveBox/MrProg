"use strict";
/*
    Command Name setnavi.js
    Function: Set's a User's Navi Symbol in the userinfo file
    Clearance: none
    Default Enabled: True
    Date Created: 03/03/18
    Last Updated: 10/10/18
    Last Update By: Th3_M4j0r
*/
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const fs_1 = require("fs");
const config = require("../files/config.json");
//command stuff
const command = {
    bigDescription: ("Use this command to change your navi symbol to something different\n"
        + "Returns:\n\t"
        + config.returnsDM),
    description: "Changes the user's navi symbol",
    enabled: true,
    fullName: "Set Navi",
    name: "setnavi",
    permissionLevel: "normal"
};
/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {string[]} args
 * @param {betterSql} sql
 */
async function run(client, message, args, sql) {
    // Debug to Console
    log_js_1.debug(`I am inside the ${command.fullName} Command.`);
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.name, message);
    }
    let navi = args[0];
    if (navi === undefined) {
        log_js_1.debug(`No Name Given`);
        return message.channel.send(`Cannot have an empty string.`);
    }
    navi = navi.toLowerCase();
    let row = await sql.getUserRow(message.author.id);
    if (!row) {
        log_js_1.debug(`Unable to locate data on ${message.author.username}`);
        return message.channel.send(`I am unable to locate any data on you, please try again`);
    }
    log_js_1.debug(`Attempting to update ${message.author.username}'s Navi Symbol`);
    row.navi = navi;
    let navi_sym = (`./img/navi_symbols/${row.navi}.png`);
    if (!fs_1.existsSync(navi_sym)) { // If file doesn't exist
        log_js_1.debug(`Invalid Navi Symbol File: ${row.navi}. Setting to Default.`);
        row.navi = "megaman";
        navi_sym = (`./img/navi_symbols/${row.navi}.png`);
        sql.setNavi(message.author.id, row.navi);
        let reply = `${message.author} invalid navi symbol file. Setting default value.`;
        return message.author.send(reply).catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
    }
    //else it does exist
    log_js_1.debug(`Valid Navi Symbol File: ${row.navi}`);
    sql.setNavi(message.author.id, row.navi);
    let reply = "Navi Symbol Updated";
    return message.author.send(reply).catch(error => {
        disabledDMs_js_1.run(message, reply);
    });
}
exports.run = run;
exports.help = command;
