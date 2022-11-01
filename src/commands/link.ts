import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  CommandInteraction,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js'

import JukialClient from '@/client'
import { BaseCommand } from '@/client/handlers/structures'

class LinkCommand extends BaseCommand {
  constructor(private readonly client: JukialClient) {
    const add = new SlashCommandSubcommandBuilder()
      .setName('add')
      .setNameLocalizations({
        'en-US': 'add',
        fr: 'ajout'
      })
      .setDescription('Add a link on your profile')
      .setDescriptionLocalizations({
        'en-US': 'Add a link on your profile',
        fr: 'Ajoutez un lien sur votre profil'
      })

    const remove = new SlashCommandSubcommandBuilder()
      .setName('remove')
      .setDescription('Remove a link from your profile')

    const command = new SlashCommandBuilder()
      .setName('link')
      .setNameLocalizations({
        'en-US': 'link',
        fr: 'lien'
      })
      .setDescription('Manage your links')
      .setDescriptionLocalizations({
        'en-US': 'Manage your links',
        fr: 'Gérez vos liens'
      })
      .addSubcommand(add)
      .addSubcommand(remove)

    super(command)
  }

  run(interaction: ChatInputCommandInteraction) {
    const subCommand = interaction.options.getSubcommand(true)

    switch (subCommand) {
      case 'add':
        this.add(interaction)
        break
    }
  }

  async add(interaction: CommandInteraction) {
    const modal = new ModalBuilder()
      .setCustomId('link-add')
      .setTitle(this.client.i18n.t('link.add.title', interaction.locale))

    const urlField = new TextInputBuilder()
      .setCustomId('link-add-url')
      .setLabel('Url')
      .setRequired(true)
      .setStyle(TextInputStyle.Short)

    const nameField = new TextInputBuilder()
      .setCustomId('link-add-name')
      .setLabel(this.client.i18n.t('link.add.name', interaction.locale))
      .setPlaceholder(
        this.client.i18n.t('link.add.default', interaction.locale)
      )
      .setRequired(false)
      .setStyle(TextInputStyle.Short)

    const urlRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
        urlField
      )
    const nameRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
        nameField
      )

    modal.setComponents([urlRow, nameRow])

    await interaction.showModal(modal)
  }
}

export default LinkCommand
