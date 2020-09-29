/* 
    Command Name setnavi.js
    Function: Set's a User's Navi Symbol in the userinfo file
    Clearance: none
    Default Enabled: True
    Date Created: 03/03/18
    Last Updated: 09/29/20
    Last Update By: AllusiveBox
*/

// Load in Required Files
const Discord = require(`discord.js`);
const fs = require(`fs`);
const betterSql = require(`../classes/betterSql.js`);
const config = require(`../files/config.json`);
const { debug, error: errorLog } = require(`../functions/log.js`);
const { run: disabledCommand } = require(`../functions/disabledCommand.js`);
const { run: disabledDMs } = require(`../functions/disabledDMs.js`);
const { run: react } = require(`../functions/react.js`);


//command stuff
const command = {
    bigDescription: ("Use this command to change your navi symbol to something different\n"
        + "Returns:\n\t"
        + config.returnsDM),
    description: "Changes the user's navi symbol",
    enabled: true,
    fullName: "Set Navi",
    name: "setnavi",
    permissionLevel: "none"
}


/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string[]} args
 * @param {betterSql} sql
 */
module.exports.run = async (client, message, args, sql) => {
    // Debug to Console
    debug(`I am inside the ${command.fullName} Command.`);

    if (!command.enabled) {
        return disabledCommand(command.name, message);
    }


    let navi = args[0];

    if (navi === undefined) {
        debug(`No Name Given`);
        await react(message, false);
        // Build the Reply
        let reply = `Cannot have an empty string.`;
        return message.author.send(reply).catch(error => {
            disabledDMs(message, reply);
        });
    }

    navi = navi.toLowerCase();


    let row = await sql.getUserRow(message.author.id);
    if (!row) {
        debug(`Unable to locate data on ${message.author.username}`);
        await react(message, false);
        return message.channel.send(`I am unable to locate any data on you, please try again`);
    }
    debug(`Attempting to update ${message.author.username}'s Navi Symbol`);
    row.navi = navi;
    let navi_sym = (`./img/navi_symbols/${row.navi}.png`);
    if (!fs.existsSync(navi_sym)) { // If file doesn't exist
        debug(`Invalid Navi Symbol File: ${row.navi}. Setting to Default.`);
        row.navi = "megaman";
        navi_sym = (`./img/navi_symbols/${row.navi}.png`);
        sql.setNavi(message.author.id, row.navi);
        let reply = `${message.author} invalid navi symbol file. Setting default value.`
        await react(message, false);
        return message.author.send(reply).catch(error => {
            disabledDMs(message, reply);
        });
    }

    debug(`Valid Navi Symbol File: ${row.navi}`);
    sql.setNavi(message.author.id, row.navi);

    await react(message);

}

module.exports.help = command;