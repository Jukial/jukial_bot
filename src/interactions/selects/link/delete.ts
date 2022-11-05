import {
  ActionRowBuilder,
  SelectMenuBuilder,
  SelectMenuInteraction
} from 'discord.js'

import BaseSelectMenu from '@/client/handlers/structures/base-select-menu'
import JukialClient from '@/client'

class LinkDeleteSelectMenu extends BaseSelectMenu {
  constructor(private readonly client: JukialClient) {
    super('link-delete-select')
  }

  async run(interaction: SelectMenuInteraction) {
    await interaction.deferUpdate()

    const user = await this.client.database.user.findOne({
      where: {
        id: interaction.user.id
      },
      relations: ['links']
    })

    if (!user || !user.links.length) {
      const subCmdName = `</link add:${interaction.message.interaction.id}>`

      return interaction.update({
        content: this.client.i18n.t('link.error-no-link', interaction.locale, {
          cmd: subCmdName
        }),
        components: []
      })
    }

    await this.client.database.link.delete(interaction.values)

    const components = await new Promise<ActionRowBuilder<SelectMenuBuilder>[]>(
      async (resolve) => {
        const updatedUser = await this.client.database.user.findOne({
          where: {
            id: interaction.user.id
          },
          relations: ['links']
        })

        if (updatedUser.links.length) {
          const selectMenu = new SelectMenuBuilder()
            .setCustomId('link-delete-select')
            .setPlaceholder(
              this.client.i18n.t(
                'link.delete.select-placeholder',
                interaction.locale
              )
            )
            .setOptions(
              updatedUser.links.map((link) => ({
                label: link.name,
                description: link.url,
                value: link.id
              }))
            )

          resolve([
            new ActionRowBuilder<SelectMenuBuilder>().setComponents(selectMenu)
          ])
        }

        resolve([])
      }
    )

    await interaction.editReply({
      content: this.client.i18n.t('link.delete.result', interaction.locale),
      components
    })
  }
}

export default LinkDeleteSelectMenu
