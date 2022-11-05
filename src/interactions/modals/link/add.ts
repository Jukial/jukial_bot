import { ModalSubmitInteraction } from 'discord.js'

import JukialClient from '@/client'
import BaseModalSubmit from '@/client/handlers/structures/base-modal-submit'
import { getTitleFromURL, validUrl } from '@/utils/functions'

class LinkAddModalSubmit extends BaseModalSubmit {
  constructor(private readonly client: JukialClient) {
    super('link-add-modal')
  }

  async run(interaction: ModalSubmitInteraction) {
    let user = await this.client.database.user.findOneBy({
      id: interaction.user.id
    })

    const url = interaction.fields.getTextInputValue('link-add-url')
    let name = interaction.fields.getTextInputValue('link-add-name')

    if (!validUrl(url))
      return interaction.reply({
        content: this.client.i18n.t('link.url-invalid', interaction.locale),
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
      this.client.collections.profileUsernames.set(user.id, user.username)
    }

    const link = this.client.database.link.create({
      name,
      url,
      user
    })
    await this.client.database.link.save(link)

    await interaction.reply({
      content: this.client.i18n.t('link.add.success', interaction.locale),
      ephemeral: true
    })
  }
}

export default LinkAddModalSubmit
