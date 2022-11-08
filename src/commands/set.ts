import JukialClient from '@/client'
import { BaseCommand } from '@/client/handlers/structures'
import {
  SlashCommandBuilder,
  SlashCommandStringOption,
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ModalActionRowComponentBuilder
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
      .setMaxLength(40)

    const username = new SlashCommandSubcommandBuilder()
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

    const bio = new SlashCommandSubcommandBuilder()
      .setName('bio')
      .setNameLocalizations({
        'en-US': 'bio',
        fr: 'bio'
      })
      .setDescription('Edit your bio')
      .setDescriptionLocalizations({
        'en-US': 'Edit your bio',
        fr: 'Modifiez votre bio'
      })

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
      .setDMPermission(true)
      .addSubcommand(username)
      .addSubcommand(bio)

    super(command)
  }

  async run(interaction: ChatInputCommandInteraction) {
    const subCommand = interaction.options.getSubcommand(true)

    switch (subCommand) {
      case 'username':
        this.username(interaction)
        break
      case 'bio':
        this.bio(interaction)
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

  async bio(interaction: ChatInputCommandInteraction) {
    const user = await this.client.database.user.findOneBy({
      id: interaction.user.id
    })

    const modal = new ModalBuilder()
      .setCustomId('set-bio-modal')
      .setTitle(this.client.i18n.t('set.bio.title', interaction.locale))

    const bioInput = new TextInputBuilder()
      .setCustomId('set-bio-input')
      .setLabel('Bio')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false)
      .setMaxLength(200)
      .setValue(user?.bio || '')

    const bioRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
        bioInput
      )

    modal.setComponents([bioRow])

    await interaction.showModal(modal)
  }
}

export default ProfileCommand
