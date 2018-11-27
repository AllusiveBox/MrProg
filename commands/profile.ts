/*
    Command Name: profile.js
    Function: Returns all data the bot has on a user in a DM.
    Clearance: none
	Default Enabled: Cannot be Disabled
    Date Created: 05/22/18
    Last Updated: 11/24/18
    Last Update By: AllusiveBox
*/

// Load in Required Files
import * as Discord from 'discord.js';
import { run as disabledDMs } from '../functions/disabledDMs.js';
import { debug, commandHelp } from '../functions/log.js';
import betterSql from '../classes/betterSql.js';
import { run as react } from '../functions/react.js';

import config = require('../files/config.json');

// Command Variables
const command : commandHelp = {
    bigDescription: ("Sends the user all data stored on them.\n"
        + "Returns:\n\t"
        + config.returnsDM),
    description: "Sends the user all data stored on them.",
    enabled: null,
    fullName: "Profile",
    name: "profile",
    permissionLevel: "normal"
}

/**
 * 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {?string[]} [args]
 * @param {betterSql} sql
 */
export async function run(client: Discord.Client, message: Discord.Message, args: string[] | null, sql: betterSql) {
    // Debug to Console Log
    debug(`I am inside the ${command.fullName} Command.`);

    let row = await sql.getUserRow(message.author.id);
    if (!row) { // Cannot Find Row
        debug(`Unable to locate any data for ${message.author.username}.`);
        let reply = `I am unable to locate any data on you. Please try again.`;
        return message.author.send(reply).catch(error => {
            return disabledDMs(message, reply);
        });
    }
    debug(`Generating userData for ${message.author.username}`);
    
    let userProfile = `${message.author}, this is the data that I have collected on you:\n`
        + `userID: ${row.userId} (This data is provided by Discord's API. It is public data)\n`
        + `userName: ${row.userName} (This is stored to keep up with nicknames. Updates every time you increase point count. It is public data)\n`
        + `battlecode: ${row.battlecode} (Set by you, the user, using the !setBC or !setBattlecode command)\n`
        + `favechip: ${row.favechip} (Feature coming soon! Maybe.)\n`
        + `navi: ${row.navi} (The Navi Symbol that displays when you use !stats)\n`
        + `clearance: ${row.clearance} (What bot permissions you have. null/none are normal users, mod and admin are as the title suggest)\n`
        + `points: ${row.points} (Your current amount of points in the server. 1 point is gained every 30 seconds when you make a post)\n`
        + `level: ${row.level} (Your current level. Each level has a number of points necessary to reach the next)\n\n`
        + `optOut: ${row.optOut !== 0 ? true : false} (If you have opted out of additional collection.)\n\n`
        + `joinDate: ${new Date(row.joinDate)} (Date you joined the server)\n\n`
        + `leftDate: ${row.leaveDate !== null ? new Date(row.leaveDate) : "N/A"} (Date you last left the server)\n\n`
        + `firstJoinDate: ${new Date(row.firstJoinDate)} (Date you originally joined the server)\n\n`
        + `To prevent me from collecting information on you, use the ${config.prefix}optOut command.\n`
        + `To have me delete all the data I have on you, use the ${config.prefix}deleteMe command. (**Note: This won't change your opt-out status**)\n`
        + `**WARNING:** Use of the ${config.prefix}deleteMe command will _permanently_ delete all data recorded on you, with no way to restore it.`;

    if (config.debug) {
        await react(message);
        return message.channel.send(userProfile);
    } else {
        return message.author.send(userProfile).then(function () {
            return react(message);
        }).catch(error => {
            disabledDMs(message, `I am sorry, ${message.author}, I am unable to DM you.\n`
                + `Please check your privacy settings and try again.`);
            return react(message, false);
        });
    }
}

export const help = command;