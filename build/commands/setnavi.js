"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const react_js_1 = require("../functions/react.js");
const fs_1 = require("fs");
const config = require("../files/config.json");
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
async function run(client, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} Command.`);
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.name, message);
    }
    let navi = args[0];
    if (navi === undefined) {
        log_js_1.debug(`No Name Given`);
        await react_js_1.run(message, false);
        let reply = `Cannot have an empty string.`;
        return message.author.send(reply).catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
    }
    navi = navi.toLowerCase();
    let row = await sql.getUserRow(message.author.id);
    if (!row) {
        log_js_1.debug(`Unable to locate data on ${message.author.username}`);
        await react_js_1.run(message, false);
        return message.channel.send(`I am unable to locate any data on you, please try again`);
    }
    log_js_1.debug(`Attempting to update ${message.author.username}'s Navi Symbol`);
    row.navi = navi;
    let navi_sym = (`./img/navi_symbols/${row.navi}.png`);
    if (!fs_1.existsSync(navi_sym)) {
        log_js_1.debug(`Invalid Navi Symbol File: ${row.navi}. Setting to Default.`);
        row.navi = "megaman";
        navi_sym = (`./img/navi_symbols/${row.navi}.png`);
        sql.setNavi(message.author.id, row.navi);
        let reply = `${message.author} invalid navi symbol file. Setting default value.`;
        await react_js_1.run(message, false);
        return message.author.send(reply).catch(error => {
            disabledDMs_js_1.run(message, reply);
        });
    }
    log_js_1.debug(`Valid Navi Symbol File: ${row.navi}`);
    sql.setNavi(message.author.id, row.navi);
    await react_js_1.run(message);
}
exports.run = run;
exports.help = command;
