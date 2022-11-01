import { ModalSubmitInteraction } from 'discord.js'
import { isWebUri } from 'valid-url'

import JukialClient from '@/client'
import BaseModalSubmit from '@/client/handlers/structures/base-modal-submit'
import { getTitleFromURL } from '@/utils/functions'

class LinkAddModalSubmit extends BaseModalSubmit {
  constructor(private readonly client: JukialClient) {
    super('link-add')
  }

  async run(interaction: ModalSubmitInteraction) {
    let user = await this.client.database.user.findOneBy({
      id: interaction.user.id
    })

    const url = interaction.fields.getTextInputValue('link-add-url')
    let name = interaction.fields.getTextInputValue('link-add-name')

    // FIX: not work with 'https://azzaz -> without .com, .fr, ...
    if (!isWebUri(url))
      return interaction.reply({
        content: this.client.i18n.t('link.add.url-invalid', interaction.locale),
        ephemeral: true
      })

    if (!name) {
      name = await getTitleFromURL(url)
    }

    if (!user) {
      const newUser = this.client.database.user.create({
        id: interaction.user.id,
        username: interaction.user.tag
      })
      user = await this.client.database.user.save(newUser)
    }

    const link = this.client.database.link.create({
      name,
      url,
      user
    })
    await this.client.database.link.save(link)

    interaction.reply({
      content: this.client.i18n.t('link.add.success', interaction.locale),
      ephemeral: true
    })
  }
}

export default LinkAddModalSubmit
