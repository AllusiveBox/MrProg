"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_js_1 = require("./log.js");
const channels = require("../files/channels.json");
const config = require("../files/config.json");
function run(member) {
    let serverName = member.guild.name;
    let prefix = config.prefix;
    let rulesID = channels.rules;
    if (!rulesID) {
        log_js_1.debug(`Unable to find the rules ID in channels.json.`
            + `Looking for another rules channel.`);
        let rulesChannel = member.guild.channels.find(val => val.name === 'rules');
        if (!rulesChannel) {
            log_js_1.debug(`Unable to find any kind of rules channel.`);
        }
        else {
            rulesID = rulesChannel.id;
        }
    }
    let rulesChannel = "the server";
    if (rulesID) {
        rulesChannel = `<#${rulesID}>`;
    }
    log_js_1.debug(`Generating welcome message for ${member.user.username}`);
    let welcomeMessage = (`Welcome to the ${serverName} server, ${member}!\n`
        + `Before you are able to post in the server, you will need to make sure `
        + `you have a verified e-mail linked to your Discord account.\n`
        + `Please note that by posting in ${serverName}, you are agreeing to the `
        + `rules found in ${rulesChannel}.\n\n\n`
        + `This bot will collect user data while you remain in ${serverName}, but `
        + `you can opt out of this at any time with the ${prefix}optOut command.\n`
        + `For a list of my commands, use !help.\n\n`);
    return welcomeMessage;
}
exports.run = run;
