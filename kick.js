const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'kick',
  description: 'Kicks a user from the server',
  userPermissions: ['KICK_MEMBERS'],
  args: true,
  usage: '<user> [reason]',
  async execute(message, args) {
    const user = message.mentions.members.first();
    if (!user) {
      return message.reply('Please mention the user you want to kick!');
    }
    const reason = args.slice(1).join(' ') || 'No reason provided';

    try {
      await user.send(`You have been kicked from ${message.guild.name}. Reason: ${reason}`);
      await user.kick(reason);
      const embed = new MessageEmbed()
        .setTitle('User Kicked')
        .addField('User', user.toString(), true)
        .addField('Moderator', message.author.toString(), true)
        .addField('Reason', reason)
        .addField('Time', new Date().toLocaleString())
        .setColor('RED')
        .setTimestamp();
      const channel = message.guild.channels.cache.find((ch) => ch.name === 'kick-logs');
      if (!channel) {
        return message.reply('I could not find a channel called `kick-logs` in this server!');
      }
      channel.send({ embeds: [embed] });
      message.reply(`Successfully kicked ${user.user.tag} from the server!`);
    } catch (err) {
      console.error(err);
      message.reply('An error occurred while trying to kick this user!');
    }
  }
}
