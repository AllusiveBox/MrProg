﻿/*
    Command Name: restart.js
    Function: Restarts the Bot
    Clearance: Owner Only
	Default Enabled: Cannot be Disabled
    Date Created: 07/18/18
    Last Updated: 10/27/18
    Last Update By: AllusiveBox

*/

// Load in Require Files
import * as Discord from 'discord.js';
import { debug, error as errorLog, commandHelp } from '../functions/log.js';
import { run as react } from '../functions/react.js';
import betterSql from '../classes/betterSql.js';

import config = require('../files/config.json');
import userids = require('../files/userids.json');

// Command Variables
const command : commandHelp = {
    bigDescription: ("Restarts the bot to allow changes to take place.\n"
        + "Returns:\n\t"
        + "This command returns nothing"),
    description: "Restart the bot",
    enabled: null,
    fullName: "Restart",
    name: "restart",
    permissionLevel: "owner"
}


/**
 *  
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string[]} args
 * @param {betterSql} sql
 */
export async function run(bot: Discord.Client, message: Discord.Message, args: string[], sql: betterSql) {
    // Debug to Console
    debug(`I am inside the ${command.fullName} command.`);

    let inUserList = false;

    // Check if Member is in User ID List
    Object.keys(userids).forEach(function (key) {
        if (userids[key] === message.author.id) { // If Member is in the User ID List...
            return inUserList = true;
        }
    });

    if (inUserList) { // If Member is In the User ID List...
        debug(`Shutting Down...`);
        await sql.close();
        debug(`Database conection closed.`);
        debug(`Alerting Owner...`);
        if (!config.debug) message.author.send(`Restarting Now...`);
        await react(message);
        process.exit(0);
    }
}

export const help = command;
