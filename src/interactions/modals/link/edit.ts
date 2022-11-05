import {
  ActionRowBuilder,
  ModalSubmitInteraction,
  SelectMenuBuilder
} from 'discord.js'

import JukialClient from '@/client'
import BaseModalSubmit from '@/client/handlers/structures/base-modal-submit'
import { getTitleFromURL, validUrl } from '@/utils/functions'

class LinkEditModalSubmit extends BaseModalSubmit {
  constructor(private readonly client: JukialClient) {
    super('link-edit-modal')
  }

  async run(interaction: ModalSubmitInteraction) {
    let user = await this.client.database.user.findOne({
      where: {
        id: interaction.user.id
      },
      relations: ['links']
    })

    if (!user || !user.links.length) {
      const subCmdName = `</link add:${interaction.message.interaction.id}>`

      return interaction.reply({
        content: this.client.i18n.t('link.error-no-link', interaction.locale, {
          cmd: subCmdName
        }),
        components: [],
        ephemeral: true
      })
    }

    const link = await this.client.database.link.findOne({
      where: {
        id: this.client.collections.linkEditIds.get(interaction.user.id)
      }
    })

    if (!link)
      return interaction.reply({
        content: this.client.i18n.t('link.edit.not-found', interaction.locale)
      })

    const url = interaction.fields.getTextInputValue('link-edit-url')
    let name = interaction.fields.getTextInputValue('link-edit-name')

    if (!validUrl(url))
      return interaction.reply({
        content: this.client.i18n.t('link.url-invalid', interaction.locale),
        ephemeral: true
      })

    if (!name) {
      name = await getTitleFromURL(url)
    }

    await this.client.database.link.save({
      ...link,
      url,
      name
    })

    user = await this.client.database.user.findOne({
      where: {
        id: interaction.user.id
      },
      relations: ['links']
    })

    const selectMenu = new SelectMenuBuilder()
      .setCustomId('link-edit-select')
      .setPlaceholder(
        this.client.i18n.t('link.edit.select-placeholder', interaction.locale)
      )
      .setMaxValues(1)
      .setOptions(
        user.links.map((link) => ({
          label: link.name,
          description: link.url,
          value: link.id
        }))
      )

    const row = new ActionRowBuilder<SelectMenuBuilder>().setComponents(
      selectMenu
    )

    await interaction.reply({
      content: this.client.i18n.t('link.edit.success', interaction.locale),
      components: [row],
      ephemeral: true
    })
  }
}

export default LinkEditModalSubmit
