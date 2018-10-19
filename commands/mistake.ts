/*
    Command Name:
    Function: 
    Clearance: none
	Default Enabled: Yes
    Date Created: 10/13/18
    Last Updated: 10/19/18
    Last Updated By: Th3_M4j0r

*/

// Load in Required Files
import * as Discord from 'discord.js';
import { debug, error as errorLog, commandHelp } from '../functions/log.js';


import config = require('../files/config.json');
import userids = require('../files/userids.json');

// Command Variables
const command : commandHelp = {
    bigDescription: ("This command informs you of what the mistake was."
        + "Returns\n\t"
        + config.returnsChannel),
    description: "Oh, mistakes were made...",
    enabled: true, // true/false
    fullName: "Mistake",
    name: "mistake",
    permissionLevel: "owner"
}

/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 */
export async function run(bot: Discord.Client, message: Discord.Message) {
    // Debug to Console
    debug(`I am inside the ${command.fullName} command.`);
    if ((message.author.id === userids.maxID) || (message.author.id === userids.ownerID)) {
        return message.channel.send({ file: "./img/mistake.png" }).catch(error => {
            errorLog(error);
            return message.channel.send(error.toString());
        });
    }
}

export const help = command;