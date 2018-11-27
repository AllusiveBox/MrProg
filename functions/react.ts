/**

    cxBot.js Mr. Prog React to Message
    Version: 1
    Author: AllusiveBox
    Date Created: 10/27/18
    Date Last Updated: 10/27/18
    Last Update By: AllusiveBox

**/

// Load in Required Files
import * as Discord from 'discord.js';
import { error as errorLog } from '../functions/log.js';

import config = require('../files/config.json');


/**
 * 
 * @param {Discord.Message} message
 * @param {?Boolean} [success=true]
 */
export async function run(message: Discord.Message, success: boolean | null = true) {
    let react = success ? config.success : config.fail;

    try {
        await message.react(react);
    } catch (error) {
        errorLog(error);
        return message.channel.send(`*${error.toString()}*`);
    }
}