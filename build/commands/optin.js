"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const log_js_1 = require("../functions/log.js");
const betterSql_js_1 = require("../classes/betterSql.js");
const config = require("../files/config.json");
const command = {
    bigDescription: ("Allows a user to opt back into data collection.\n"
        + "Returns:\n\t" + config.returnsDM),
    description: "Opts back in for data collection",
    enabled: null,
    fullName: "Opt-In",
    name: "optIn",
    permissionLevel: "normal"
};
async function run(client, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} Command.`);
    let row = await sql.getUserRow(message.author.id);
    if (!row) {
        log_js_1.debug(`Unable to locate any data for ${message.author.username}.`);
        let reply = `I am unable to locate any data on you. Please try again.`;
        return message.author.send(reply).catch(error => {
            return disabledDMs_js_1.run(message, reply);
        });
    }
    if (row.optOut === betterSql_js_1.optOutChoice.optedIn) {
        log_js_1.debug(`${message.author.username} attempted to opt-in while already opted in.`);
        let reply = `You are already opted in, ${message.author}. `
            + `To opt out, use the ${config.prefix}optOut command.`;
        return message.author.send(reply).catch(error => {
            return disabledDMs_js_1.run(message, reply);
        });
    }
    log_js_1.debug(`${message.author.username} is being opted in, resetting everything`);
    await sql.optInUser(message.author.id);
    if (row.points === null) {
        await sql.setPoints(message.author.id, 0, 0, message.author.username);
        await sql.setBattleCode(message.author.id, "0000-0000-0000");
        await sql.setNavi(message.author.id, "megaman");
    }
    let reply = `I have updated your preferences, ${message.author}. `
        + `If you wish to opt-out of future data collection `
        + `please use the ${config.prefix}optOut command.`;
    return message.author.send(reply).catch(error => {
        return disabledDMs_js_1.run(message, reply);
    });
}
exports.run = run;
exports.help = command;
