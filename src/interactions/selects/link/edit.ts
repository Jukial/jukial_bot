import {
  ActionRowBuilder,
  chatInputApplicationCommandMention,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  SelectMenuInteraction,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js'

import BaseSelectMenu from '@/client/handlers/structures/base-select-menu'
import JukialClient from '@/client'

class LinkEditSelectMenu extends BaseSelectMenu {
  constructor(private readonly client: JukialClient) {
    super('link-edit-select')
  }

  async run(interaction: SelectMenuInteraction) {
    const user = await this.client.database.user.findOne({
      where: {
        id: interaction.user.id
      },
      relations: ['links']
    })

    if (!user || !user.links.length)
      return interaction.update({
        content: this.client.i18n.t('link.error-no-link', interaction.locale, {
          cmd: chatInputApplicationCommandMention(
            interaction.message.interaction.commandName,
            'add',
            interaction.message.interaction.id
          )
        }),
        components: []
      })

    const link = user.links.find((l) => l.id === interaction.values[0])

    if (!link)
      return interaction.update({
        content: this.client.i18n.t('link.edit.not-found', interaction.locale)
      })

    const modal = new ModalBuilder()
      .setCustomId(`link-edit-modal${link.id}`)
      .setTitle(this.client.i18n.t('link.edit.title', interaction.locale))

    const urlField = new TextInputBuilder()
      .setCustomId('link-edit-url')
      .setLabel('Url')
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setValue(link.url)

    const nameField = new TextInputBuilder()
      .setCustomId('link-edit-name')
      .setLabel(this.client.i18n.t('link.name', interaction.locale))
      .setPlaceholder(
        this.client.i18n.t('link.name-default', interaction.locale)
      )
      .setRequired(false)
      .setStyle(TextInputStyle.Short)
      .setValue(link.name)

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

export default LinkEditSelectMenu
