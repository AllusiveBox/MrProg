"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disabledCommand_js_1 = require("../functions/disabledCommand.js");
const log_js_1 = require("../functions/log.js");
const userids = require("../files/userids.json");
const ownerID = userids.ownerID;
const command = {
    bigDescription: ("OWNER ONLY. ALL ACCESS COMMAND."),
    description: "OWNER ONLY. ALL ACCESS COMMAND.",
    enabled: false,
    fullName: "Eval",
    name: "eval",
    permissionLevel: "owner"
};
function clean(text) {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`"
            + String.fromCharCode(8203)).replace(/@/g, "@"
            + String.fromCharCode(8203));
    else {
        return text;
    }
}
async function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (message.author.id !== userids.ownerID) {
        let reply = (`WARNING. ATTEMPTED USE OF EVAL COMMAND BY `
            + `**${message.author.username}**`);
        log_js_1.debug(reply);
        console.log(reply);
        return bot.users.get(userids.ownerID).send(reply).catch(error => {
            log_js_1.error(reply);
            log_js_1.error(error);
        });
    }
    else {
        if (!command.enabled) {
            return disabledCommand_js_1.run(command.fullName, message);
        }
        else {
            try {
                const code = args.join(" ");
                let evaled = await eval(code);
                if (typeof evaled !== "string") {
                    evaled = require("util").inspect(evaled);
                }
                message.channel.send(clean(evaled), { code: "xl" });
            }
            catch (error) {
                try {
                    message.channel.send(`\`ERROR:\` \`\`\`xl\n${clean(error)}\n\`\`\``);
                    log_js_1.error(error);
                }
                catch (error) {
                    message.channel.send(`\`ERROR UNABLE TO SEND ERROR MESSAGE DUE TO `
                        + `CHARACTER RESTRICTION. ERROR HAS BEEN LOGGED.\``);
                    log_js_1.error(error);
                }
            }
        }
    }
    return userids.ownerID = ownerID;
}
exports.run = run;
exports.help = command;
