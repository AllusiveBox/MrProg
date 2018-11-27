/*
    Command Name: oof.js
    Function: Returns an oof
    Clearance: none
	Default Enabled: Yes
    Date Created: 01/15/18
    Last Updated: 10/06/18
    Last Updated By: Th3_M4j0r

*/

// Load in Required Files
import * as Discord from 'discord.js';
import { returnsChannel } from '../files/config.json';
import { run as disabledCommand } from '../functions/disabledCommand.js';
import { debug, error as errorLog, commandHelp } from '../functions/log.js';

// Command Stuff
const command : commandHelp = {
    bigDescription: ("Sends a bigger oof!\n"
        + "Returns:\n\t" + returnsChannel),
    description: "Returns a big oof",
    enabled: true,
    fullName: "Big Oof!",
    name: "bigoof",
    permissionLevel: "normal"
}


/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 */

export async function run(bot: Discord.Client, message: Discord.Message) {
    // Debug to Console
    debug(`I am inside the ${command.fullName} command.`);

    // Enabled Command Test
    if (!command.enabled) {
        return disabledCommand(command.name, message);
    }

    try {
        return message.channel.send({ file: "./img/bigoof.png" });
    } catch (error) {
        errorLog(error);
    }
}

export const help = command;