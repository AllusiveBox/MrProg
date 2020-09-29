// Load in Required Files
const Discord = require(`discord.js`);
const config = require(`../files/config.json`);
const channels = require(`../files/channels.json`);
const userids = require(`../files/userids.json`);
const { run: disabledDMs } = require(`../functions/disabledDMs.js`);
const { run: disabledCommand } = require(`../functions/disabledCommand.js`);
const { run: dmCheck } = require(`../functions/dmCheck.js`);
const { run: hasElevatedPermissions } = require('../functions/hasElevatedPermissions.js');
const { debug } = require(`../functions/log.js`);
const { run: react } = require(`../functions/react.js`);


// Command Variables
const command = {
    adminOnly: false,
    bigDescription: "N/A",
    description: "N/A",
    enabled: true,
    fullName: "announcerule",
    name: "announcerule",
    permissionLevel: "mod"
}


/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 */
module.exports.run = async (bot, message, args) => {
    // Debug to Console
    debug(`I am inside the ${command.fullName} command.`);

    // Enabled Command Test
    if (!command.enabled) {
        return disabledCommand(command.name, message);
    }

    let ruleEmbed = new Discord.MessageEmbed()
        .setAuthor('Rules', 'https://i.imgur.com/a75vd6Y.png')
        .addField('0) **We reserve the right to update and change the server rules at any time with a notice.**', 'We will provide a ping with any rule changes when they take place.')
        .addField('1) **Don\'t be that guy.**', 'This means no nsfw content, spam, doxxing, and verbally harassing other users.')
        .addField('2) **Please do not bother the dev team.**', 'If you are having an in-game issue see if it is already in <#425062496093601839>. If you see your problem not listed there, please take it to <#200390805167276032>.')
        .addField('3) **Keep discussions in their respective channels.**', 'Check the channel descriptions to see what the purpose of each respective channel is.')
        .addField('4) **Discussion or distribution of hacking tools is not allowed here.**', 'If a flaw or exploit is found with the game, please take it to <#200390805167276032>. Disciplinary action will be taken to those using these exploits on unwilling players.')
        .addField('5) **No promotional or affiliated links without prior approval from an admin or moderator.**', 'This includes links to art pages, fangame projects, streams, commission pages, and other forms of media sharing that does not involve Chrono X.')
        .addField('6) **Circumventing disciplinary action**', 'taken against you will result in increased severity, increased length, or even a ban.')
        .addBlankField()
        .addField('**The official Discord Terms of Service and Guidelines are still in full effect.**', 'For anything beyond the rules laid out above, they can be found in the following links:\n\nhttps://discordapp.com/terms \nhttps://discordapp.com/guidelines');
	try {
        bot.channels.cache.get(channels.rules).send({
            files: [{
                attachment: './img/rule.png',
                name: 'rule.png'
            }],
            embed: ruleEmbed
        })
		console.log("sent!");
	} catch(error) {
		message.channel.send(error);
	}

}

module.exports.help = command;
