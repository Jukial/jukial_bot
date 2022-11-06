import { ModalSubmitInteraction } from 'discord.js'

import JukialClient from '@/client'
import BaseModalSubmit from '@/client/handlers/structures/base-modal-submit'

class SetBioModalSubmit extends BaseModalSubmit {
  constructor(private readonly client: JukialClient) {
    super('set-bio-modal')
  }

  async run(interaction: ModalSubmitInteraction) {
    const bio =
      interaction.fields
        .getTextInputValue('set-bio-input')
        .trim()
        .replace(/\n{3,}/g, '\n\n') || null

    const updated = await this.client.database.user.update(
      interaction.user.id,
      {
        bio
      }
    )

    if (!updated.affected) {
      const user = this.client.database.user.create({
        id: interaction.user.id,
        username: interaction.user.tag,
        bio
      })
      await this.client.database.user.save(user)

      this.client.collections.profileUsernames.set(
        interaction.user.id,
        interaction.user.tag
      )
    }

    await interaction.reply({
      content: this.client.i18n.t('set.bio.success', interaction.locale),
      ephemeral: true
    })
  }
}

export default SetBioModalSubmit
