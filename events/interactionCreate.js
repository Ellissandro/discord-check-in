const Discord = require('discord.js');
const { queue } = require('../config.json');
const { ActionRowBuilder, TextInputStyle, ModalBuilder, TextInputBuilder } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(client, interaction) {
    if (interaction.customId === 'registrar') {
      const modal = new ModalBuilder()
        .setCustomId('modal')
        .setTitle('Formulário Yakuza');
  
      const fields = [
        { name: 'nome', label: '👤NOME DO PERSONAGEM', placeholder: 'Exemplo: João Silva' },
        { name: 'passaporte', label: '🪪INSIRA SEU PASSAPORTE', placeholder: 'Exemplo: 33443' },
        { name: 'numero', label: '📱INSIRA SEU NÚMERO', placeholder: 'Exemplo: 000-000' },
        { name: 'periodo', label: '🕑INSIRA O PERÍODO', placeholder: 'Exemplo: Manhã' },
        { name: 'idade', label: '📍INSIRA SUA IDADE', placeholder: 'Exemplo: 18' }
      ];
  
      const components = fields.map(field =>
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId(field.name)
            .setLabel(field.label)
            .setPlaceholder(field.placeholder)
            .setStyle(TextInputStyle.Short)
        )
      );
      modal.addComponents(...components);
      usuario = interaction.user;
      await interaction.showModal(modal);
    }
  
    if (interaction.isModalSubmit() && interaction.customId === 'modal') {
      const fields = ['nome', 'passaporte', 'numero', 'periodo', 'idade'];
      const values = {};
  
      for (const field of fields) {
        values[field] = interaction?.fields?.getTextInputValue(field);
      }
  
      nomeUsuario = values.nome;
      numeroUsuario = values.numero;
      const canalDestino = client.channels.cache.get(queue);
      const fotoUsuario = interaction.user.displayAvatarURL();
  
      const embed = new Discord.EmbedBuilder()
        .setColor(0x0099FF)
        .setAuthor({ name: 'Novo Cadastro', iconURL: client.user.displayAvatarURL() })
        .setThumbnail(fotoUsuario)
        .addFields(
          { name: ':bust_in_silhouette: **Nome**', value: '```' + values.nome + '```' },
          { name: '\u200A', value: '\u200A' },
          { name: ':identification_card: **Passaporte**', value: '```' + values.passaporte + '```' },
          { name: '\u200A', value: '\u200A' },
          { name: ':mobile_phone: **Número**', value: '```' + values.numero + '```' },
          { name: '\u200A', value: '\u200A' },
          { name: ':clock1: **Período**', value: '```' + values.periodo + '```' },
          { name: '\u200A', value: '\u200A' },
          { name: ':birthday: **Idade**', value: '```' + values.idade + '```' }
        );
  
      const buttons = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
          .setCustomId('aprovar')
          .setLabel('Aprovar')
          .setStyle(Discord.ButtonStyle.Success),
        new Discord.ButtonBuilder()
          .setCustomId('reprovar')
          .setLabel('Rejeitar')
          .setStyle(Discord.ButtonStyle.Danger)
      );
  
      await interaction.deferUpdate();
  
      canalDestino.send({ embeds: [embed], components: [buttons] });
    }
  
      if (interaction.isButton() && interaction.customId === 'aprovar' || interaction.customId === 'reprovar') {
        const foiAprovado = interaction.component.label === 'Aprovar';
        const opcaoSelecionada = foiAprovado ? 'Aprovado' : 'Rejeitado';
        const canalDestino = client.channels.cache.get(queue);
  
        const novoBotao = new Discord.ButtonBuilder()
            .setCustomId('resposta')
            .setLabel(opcaoSelecionada)
            .setDisabled(true)
            .setStyle(Discord.ButtonStyle.Secondary);
  
          interaction.message.components[0].components = [novoBotao];
  
          await interaction.update({
            components: interaction.message.components,
          });
            
        const embed = new Discord.EmbedBuilder()
          .setColor(opcaoSelecionada === 'Aprovado' ? '#00FF00' : '#FF0000')
          .setTitle(`Novo usuário ${opcaoSelecionada.toLowerCase()}`)
          .setThumbnail(client.user.displayAvatarURL())
          .addFields(
            { name: '**Usuário:**', value: `${nomeUsuario} | ${numeroUsuario}` },
            { name: '\u200A', value: '\u200A' },
            { name: '**Recrutador:**', value: `${interaction.user.username}` },
          );

          const embedOne = new Discord.EmbedBuilder()

          if (foiAprovado) {
            embedOne.setColor('#00FF00')
              .setAuthor({ name: `😁 Você foi aprovado!!`})
              .setDescription(`${usuario.toString()} você foi aprovado em nosso servidor Yakuza Fico feliz por você seja bem-vindo(a) a nossa família!`);
          } else {
            embedOne.setColor('#FF0000')
              .setAuthor({name:'😔 Reprovado'})
              .setDescription(`${usuario.toString()} Infelizmente, você foi reprovado em nosso servidor Yakuza. Sentimos muito.`);
          }

        usuario.send({ embeds: [embedOne], components: [] });
        canalDestino.send({ embeds: [embed], components: [] })
      }
  },
};