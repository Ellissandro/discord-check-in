    
const { Client, Events,Collection, GatewayIntentBits, REST, Routes, ActionRowBuilder, TextInputStyle, ModalBuilder, TextInputBuilder,  ButtonBuilder, ButtonStyle,  } = require('discord.js');
const { guildId, token, queue } = require("./config.json");
const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ] });
const Discord = require("discord.js")
client.commands = new Collection();
const prefix = '';

const pingCommand = {
  name: 'ping',
  description: 'Ping!',
  execute(message, args) {
    message.channel.send('Pong!');
  },
};

const button = {
  name: 'button',
  description: 'button!',
  execute(message, args) {
    message.channel.send('button!');
  },
};


const erickCommand = {
  name: 'erique',
  description: 'erique',
  execute(message, args) {
    message.channel.send('Erique é um viado');
  },
};

client.commands.set(pingCommand.name, pingCommand);
client.commands.set(erickCommand.name, erickCommand);
client.commands.set(button.name, button);

client.once(Events.ClientReady, () => {
	  const channel = client.channels.cache.get(guildId);
    const embedOne = new Discord.EmbedBuilder()
        .setColor('White')
        .setAuthor({ name: `📒 Formulário da Yakuza`})
        .setDescription(`Clique no botão abaixo para começar seu registro!`)

      const button = new Discord.ActionRowBuilder().addComponents(
          new Discord.ButtonBuilder()
          .setCustomId('registrar')
          .setEmoji('📃')
          .setLabel('Botão de Registar!')
          .setStyle(Discord.ButtonStyle.Success)
      )

    channel.send({ embeds: [embedOne], components: [button] });
  });

  client.on('messageCreate', async message => {
    if (message.author.bot) return;

  });

  let nomeUsuario = '';
  let numeroUsuario = '';
  let fotoUsuario = '';
  client.on(Events.InteractionCreate, async interaction => {
    if (interaction.customId === 'registrar') {

      const modal = new ModalBuilder()
        .setCustomId('modal')
        .setTitle('Formulário Yakuza');

      const nome = new TextInputBuilder()
        .setCustomId('nome')
        .setLabel("👤NOME DO PERSONAGEM")
        .setPlaceholder('Exemplo: João Silva')
        .setStyle(TextInputStyle.Short);

      const passaporte = new TextInputBuilder()
        .setCustomId('passaporte')
        .setLabel("🪪INSIRA SEU PASSAPORTE")
        .setPlaceholder('Exemplo: 33443')
        .setStyle(TextInputStyle.Short);

      const numero = new TextInputBuilder()
        .setCustomId('numero')
        .setLabel("📱INSIRA SEU NÚMERO")
        .setPlaceholder('Exemplo: 000-000')
        .setStyle(TextInputStyle.Short);

      const periodo = new TextInputBuilder()
        .setCustomId('periodo')
        .setLabel("🕑INSIRA O PERÍODO")
        .setPlaceholder('Exemplo: Manhã')
        .setStyle(TextInputStyle.Short);

      const idade = new TextInputBuilder()
        .setCustomId('idade')
        .setLabel("📍INSIRA SUA IDADE")
        .setPlaceholder('Exemplo: 18')
        .setStyle(TextInputStyle.Short);

      const one = new ActionRowBuilder().addComponents(nome);
      const two = new ActionRowBuilder().addComponents(passaporte);
      const three = new ActionRowBuilder().addComponents(numero);
      const four = new ActionRowBuilder().addComponents(periodo);
      const five = new ActionRowBuilder().addComponents(idade);

      modal.addComponents(one, two, three, four, five)

      await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'modal') {
        const nome = interaction?.fields?.getTextInputValue('nome');
        nomeUsuario = nome;
        const passaporte = interaction?.fields?.getTextInputValue('passaporte');
        const numero = interaction?.fields?.getTextInputValue('numero');
        numeroUsuario = numero;
        const periodo = interaction?.fields?.getTextInputValue('periodo');
        const idade = interaction?.fields?.getTextInputValue('idade');
  
        const canalDestino = client.channels.cache.get(queue); // Substitua pelo ID do canal de destino
        fotoUsuario = interaction.user.displayAvatarURL();

        const embed = new Discord.EmbedBuilder()
          .setColor(0x0099FF)
          .setAuthor({ name: 'Novo Cadastro', iconURL: client.user.displayAvatarURL() })
          .setThumbnail(fotoUsuario)
          .addFields(
            { name: ':bust_in_silhouette: **Nome**', value: '```' + nome + '```' },
            { name: '\u200A', value: '\u200A' },
            { name: ':identification_card: **Passaporte**', value: '```' + passaporte+ '```' },
            { name: '\u200A', value: '\u200A' },
            { name: ':mobile_phone: **Número**', value: '```' + numero+ '```' },
            { name: '\u200A', value: '\u200A' },
            { name: ':clock1: **Período**', value: '```' + periodo+ '```'},
            { name: '\u200A', value: '\u200A' },
            { name: ':birthday: **Idade**', value: '```' + idade+ '```'}
          );

          const buttons = new Discord.ActionRowBuilder().addComponents(
              new Discord.ButtonBuilder()
                  .setCustomId('aprovar')
                  .setLabel('Aprovar')
                  .setStyle(Discord.ButtonStyle.Success),
              new Discord.ButtonBuilder()
                  .setCustomId('reprovar')
                  .setLabel('Rejeitar')
                  .setStyle(Discord.ButtonStyle.Danger),
          )

          await interaction.deferUpdate();

          canalDestino.send({ embeds: [embed], components: [buttons] });
      }
    }

    if (interaction.isButton() && interaction.customId === 'aprovar' || interaction.customId === 'reprovar') {
      const opcaoSelecionada = interaction.component.label === 'Aprovar' ? 'Aprovado' : 'Rejeitado';
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
        .setColor(0x0099FF)
        .setTitle(`Novo usuário ${opcaoSelecionada.toLowerCase()}`)
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
          { name: '**Usuário:**', value: `${nomeUsuario} | ${numeroUsuario}` },
          { name: '\u200A', value: '\u200A' },
          { name: '**Recrutador:**', value: `${interaction.user.username}` },
        );

      canalDestino.send({ embeds: [embed], components: [] })
    }
  });

client.login(token);