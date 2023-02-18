const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Bans a user from the server.',
  userPermissions: ['BAN_MEMBERS'],
  botPermissions: ['BAN_MEMBERS'],
  async execute(message, args) {
    const user = message.mentions.users.first();

    if (!user) {
      return message.reply('Please mention the user to ban.');
    }

    const member = message.guild.members.cache.get(user.id);

    if (!member) {
      return message.reply('That user is not in this server.');
    }

    if (!member.bannable) {
      return message.reply('I cannot ban that user.');
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';
    const timestamp = new Date().toISOString();

    await member.ban({ reason: reason });

    const banEmbed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle('User Banned')
      .addField('User', `${user.tag} (${user.id})`)
      .addField('Moderator', `${message.author.tag}`)
      .addField('Reason', reason)
      .addField('Time', timestamp)
      .setTimestamp();

    const channel = message.guild.channels.cache.find(channel => channel.name === 'ban-logs');

    if (!channel) {
      return message.reply('Could not find the `ban-logs` channel.');
    }

    channel.send({ embeds: [banEmbed] });

    try {
      await user.send(`You have been banned from ${message.guild.name}. Reason: ${reason}`);
    } catch (err) {
      console.log(`Failed to send DM to user: ${err}`);
    }
  }
};
