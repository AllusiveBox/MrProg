"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const log_js_1 = require("../functions/log.js");
class commandBot extends Discord.Client {
    constructor(options) {
        log_js_1.debug('Constructing commandBot');
        super(options);
        this.commands = new Discord.Collection();
        this.isKicking = false;
    }
}
exports.commandBot = commandBot;
