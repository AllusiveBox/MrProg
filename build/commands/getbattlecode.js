"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("../functions/log.js");
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const config = require("../files/config.json");
const command = {
    bigDescription: ("Returns a mentioned user's battle code. If no user is "
        + "mentioned, it will return the command user's battle code instead.\n"
        + "Returns:\n\t" + config.returnsChannel),
    description: "Returns the mentioned user's battle code, or the user's "
        + "if nobody is mentioned",
    enabled: true,
    fullName: "Get Battlecode",
    name: "getBattleCode",
    permissionLevel: "normal"
};
async function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.name} command.`);
    let prefix = config.prefix;
    if (!command.enabled) {
        return disabledCommand_js_1.run(command.name, message);
    }
    if (dmCheck_js_1.run(message, command.name))
        return;
    let member = message.mentions.members.first();
    let reply;
    if (!member) {
        log_js_1.debug(`No member provided. Looking up code for `
            + `${message.author.username}`);
        member = message.member;
        reply = (`I am sorry, ${message.author}, you have yet to set `
            + `your Battle Mate Code.\n`
            + `To set your code, use the ${prefix}setBattleCode command.`);
    }
    else {
        log_js_1.debug(`Looking up code for ${member.user.username}.`);
    }
    let row = await sql.getUserRow(member.user.id);
    if (!row) {
        reply = (`I am sorry, ${message.author}, ${member.user.username} `
            + `has yet to set their Battle Mate Code.`);
        log_js_1.debug(`${member.user.username} does not exist in the database.`
            + `Unable provide a battle code.`);
        return message.channel.send(reply);
    }
    let battleCode = row.battlecode;
    if (!battleCode) {
        reply = (`I am sorry, ${message.author}, ${row.userName} `
            + `has yet to set their Battle Mate Code.`);
        log_js_1.debug(`${row.userName} has not yet set their code.`);
        return message.channel.send(reply);
    }
    log_js_1.debug(`Generating message with ${row.userName}'s `
        + `battlecode.`);
    return message.channel.send(`${row.userName}'s Battle Mate Code:\n`
        + `\`\`\`${battleCode}\`\`\``);
}
exports.run = run;
exports.help = command;
