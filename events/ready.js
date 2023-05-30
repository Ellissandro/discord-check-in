const Discord = require('discord.js');
const { guildId } = require('../config.json');

module.exports = {
  name: 'ready',
  execute(client) {
    const channel = client.channels.cache.get(guildId);
    const embedOne = new Discord.EmbedBuilder()
      .setColor('White')
      .setAuthor({ name: `📒 Formulário da Yakuza`})
      .setDescription(`Clique no botão abaixo para começar seu registro!`);

    const button = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setCustomId('registrar')
        .setEmoji('📃')
        .setLabel('Botão de Registar!')
        .setStyle(Discord.ButtonStyle.Success)
    );

    channel.send({ embeds: [embedOne], components: [button] });
  },
};