﻿/*
    Command Name: rip.js
    Function: Pays respect to fallen Mr. Progs
    Clearance: none
	Default Enabled: Yes
    Date Created: 10/17/17
    Last Updated: 11/17/18
    Last Updated By: AllusiveBox

*/

// Load in Required Files
import * as Discord from 'discord.js';
import * as fs from 'fs';
import { debug, error as errorLog, commandHelp } from '../functions/log.js';
import { run as disabledCommand } from '../functions/disabledCommand.js';


import config = require('../files/config.json');


var counter = getCounter(null);

// Command Stuff
const command: commandHelp = {
    bigDescription: ("Use this command to increase the rip counter.\n"
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Pay respect to fallen Progs",
    enabled: true,
    fullName: "RIP",
    name: "rip",
    permissionLevel: "normal"
}

/**
 * 
 * @param {?Discord.Message} [message]
 */
function getCounter(message: Discord.Message | null) {
    // Get Counter
    try {
        counter = require(`../files/counter.json`);
    } catch (error) {
        errorLog(error);
        return message.channel.send(`*${error.toString()}*`);
    }

    return counter;
}

/**
 * 
 * @param {?Discord.Message} message 
 */
export function getCount(message: Discord.Message | null) {
    // Debug to Console
    debug(`I am inside the rip.getCount function.`);

    let reply = `Current counter.rip.total is: ${counter.rip.total}`;

    if (message) {
        return message.channel.send(reply);
    } else {
        debug(reply);
        return reply;
    }
}

/**
 * 
 * @param {?number} [newCount = null]
 * @param {?Discord.Message} [message = null]
 */
export function setCount(newCount: number | null = null, message: Discord.Message | null = null) {
    // Debug to Console
    debug(`I am inside the rip.setCount function.`);

    // Get the Counter
    let newCounter = counter;

    // Debug Before
    debug(`Previous counter.rip.total: ${newCounter.rip.total}`);


    if (newCount === null) { // If No newCount passed...
        // Increase RIP Count
        newCounter.rip.total++;
    } else {
        newCounter.rip.total = newCount;
    }

    // Debug After
    debug(`New counter.rip.total: ${newCounter.rip.total}`);

    // Save Edited File
    fs.writeFile(`./files/counter.json`, JSON.stringify(newCounter), error => {
        if (error) {
            errorLog(error);
            if (message) { // If Message Param Passed...
                return message.channel.send(`*${error.toString()}*`);
            }
            return;
        }
    });
    // Save Successful
    debug(`Successfully saved!`);

    // Update command.counter
    counter = newCounter;
    return true;
}

/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {String} [args=null]
 */
export async function run(bot: Discord.Client, message: Discord.Message, args: String[] = null) {
    // Debug to Console
    debug(`I am inside the ${command.name} command.`);

    // Enabled Command Test
    if (!command.enabled) {
        return disabledCommand(command.name, message);
    }

    if (args[0]) {
        let respectTo = args.slice(0).join(" ");
        return message.channel.send(`${message.author} has paid respect to ${respectTo}! RIP!`);
    }

    // Get Counter
    let newCounter = counter;

    // Check if Counter is Valid
    if (!newCounter) return;

    // Update the Counter
    setCount(null);

    // Build the Reply
    let reply = `${counter.rip.total} `;

    if (counter.rip.total > 1) {
        reply = (reply + "people have paid respect to fallen Mr. Progs.");
    } else if (counter.rip.total === 1) {
        reply = (reply + "person has paid respect to fallen Mr. Progs.");
    } else {
        reply = `How did you get here, ${message.author}? Please don't do that again.`;
    }

    return message.channel.send(reply);
}

export const help = command;