"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const log_js_1 = require("../functions/log.js");
const betterSql_js_1 = require("../classes/betterSql.js");
const config = require("../files/config.json");
const command = {
    bigDescription: ("Allows a user to opt out of data collection.\n"
        + "Returns:\n\t" + config.returnsDM),
    description: "Opts out of data collection",
    enabled: null,
    fullName: "Opt-Out",
    name: "optOut",
    permissionLevel: "normal"
};
async function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} Command.`);
    let row = await sql.getUserRow(message.author.id);
    if (!row) {
        log_js_1.debug(`Unable to locate any data for ${message.author.username}.`);
        let reply = `I am unable to locate any data on you. Please try again.`;
        return message.author.send(reply).catch(error => {
            return disabledDMs_js_1.run(message, reply);
        });
    }
    if (row.optOut === betterSql_js_1.optOutChoice.optedOut) {
        log_js_1.debug(`${message.author.username} attempted to opt-out while already opted out.`);
        let reply = `You are already opted out, ${message.author}. `
            + `To opt back in, use the ${config.prefix}optIn command.`;
        return message.author.send(reply).catch(error => {
            return disabledDMs_js_1.run(message, reply);
        });
    }
    log_js_1.debug(`${message.author.username} is being opted-out`);
    await sql.optOutUser(message.author.id);
    let reply = `No further data on you will be collected, `
        + `however if you want any existing data to be deleted, `
        + `use the ${config.prefix}deleteMe command. If you `
        + `wish to have data collected again, use the `
        + `${config.prefix}optIn command`;
    return message.author.send(reply).catch(error => {
        return disabledDMs_js_1.run(message, reply);
    });
}
exports.run = run;
exports.help = command;
