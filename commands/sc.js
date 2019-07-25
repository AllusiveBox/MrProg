/*
    Command Name: !sc
    Function: Returns an embed with a screenshare link.
    Clearance: none
    Default Enabled: Yes
    Date Created: 07/25/19
    Last Updated: 07/25/19
    Last Update By: DeCoded_Void
*/

// Load in Required Files
const Discord = require(`discord.js`);
const config = require(`../files/config.json`);
const { debug, error: errorLog } = require(`../functions/log.js`);
const { run: disabledCommand } = require(`../functions/disabledCommand.js`);
const { run: react } = require(`../functions/react.js`);

// Command Variables
const command = {
    bigDescription: ("Gives a convenient link for screensharing in a Voice Chat."
        + "Returns:\n\t"
        + config.returnsChannel),
    description: "Bot replies screenshare link.",
    enabled: true,
    fullName: "Screenchat",
    name: "sc",
    permissionLevel: "normal"
}


/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string[]} [args]
 */
module.exports.run = async (bot, message, args) => {
    // Debug to Console
    debug(`I am in the ${command.fullName} command.`);

    // Enabled Command Test
    if (!command.enabled) {
        return disabledCommand(command.name, message);
    }

    // Get the Member's Avatar
    let avatar = "https://vignette.wikia.nocookie.net/aura-kingdom/images/1/18/Discord_icon.png/revision/latest?cb=20170108193813";
    try {
        avatar = message.author.avatarURL.split("?");
        avatar = avatar[0];
    } catch (error) {
        errorLog(error);
    }

    try {
      // Build the Embed
      let scEmbed = new Discord.RichEmbed()
          .setTitle('Screenshare')
          .setDescription(`[\uD83D\uDD0A{ctx.author.voice.channel.name}](<https://discordapp.com/channels/${message.guild.id}/${message.member.voiceChannel.id}>)`)
          .setColor('#00C957')
          .setFooter(`${message.author.username}`, `${avatar}`);
    } catch (error) {
        // Logs error in case of bugs
        errorLog(error);
        return message.channel.send("You must be in a Voice Channel in a server in order to use this command...");
    }

    // Return message (embed) to channel
    return message.channel.send(scEmbed).then(function () {
          return react(message);
      }).catch(error => {
          errorLog(error);
          return react(message, false);
      });

}

module.exports.help = command;
