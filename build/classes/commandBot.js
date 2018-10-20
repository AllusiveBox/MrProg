"use strict";
/**
 * Mr. Prog command class
 * Version 4.1.0
 * Author: Th3_M4j0r
 * Date Started: 10/08/18
 * Last Updated: 10/19/18
 * Last Updated By: Th3_M4j0r
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const log_js_1 = require("../functions/log.js");
class commandBot extends Discord.Client {
    constructor(options) {
        log_js_1.debug('Constructing commandBot');
        super(options);
        this.commands = new Discord.Collection();
    }
}
exports.commandBot = commandBot;
