import JukialClient from '@/client'
import { BaseCommand } from '@/client/handlers/structures'
import {
  SlashCommandBuilder,
  SlashCommandStringOption,
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder
} from 'discord.js'

class ProfileCommand extends BaseCommand {
  constructor(private readonly client: JukialClient) {
    const usernameOption = new SlashCommandStringOption()
      .setName('username')
      .setNameLocalizations({
        'en-US': 'username',
        fr: 'nom_utilisateur'
      })
      .setDescription('Your username')
      .setDescriptionLocalizations({
        'en-US': 'Your username',
        fr: "Votre nom d'utilisateur"
      })
      .setRequired(true)

    const user = new SlashCommandSubcommandBuilder()
      .setName('username')
      .setNameLocalizations({
        'en-US': 'username',
        fr: 'nom_utilisateur'
      })
      .setDescription('Edit your username')
      .setDescriptionLocalizations({
        'en-US': 'Edit your username',
        fr: "Modifiez votre nom d'utilisateur"
      })
      .addStringOption(usernameOption)

    const command = new SlashCommandBuilder()
      .setName('set')
      .setNameLocalizations({
        'en-US': 'set',
        fr: 'définir'
      })
      .setDescription('Edit your profile or settings')
      .setDescriptionLocalizations({
        'en-US': 'Edit your profile or settings',
        fr: 'Modifiez votre profil ou des paramètres'
      })
      .addSubcommand(user)

    super(command)
  }

  async run(interaction: ChatInputCommandInteraction) {
    const subCommand = interaction.options.getSubcommand(true)

    switch (subCommand) {
      case 'username':
        this.username(interaction)
        break
    }
  }

  async username(interaction: ChatInputCommandInteraction) {
    const username = interaction.options.getString('username', true)

    const updated = await this.client.database.user.update(
      interaction.user.id,
      {
        username
      }
    )

    if (!updated.affected) {
      const user = this.client.database.user.create({
        id: interaction.user.id,
        username
      })
      await this.client.database.user.save(user)
    }

    this.client.collections.profileUsernames.set(interaction.user.id, username)

    await interaction.reply({
      content: this.client.i18n.t('set.username.success', interaction.locale),
      ephemeral: true
    })
  }
}

export default ProfileCommand
