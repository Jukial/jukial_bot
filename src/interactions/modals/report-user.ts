import { ModalSubmitInteraction } from 'discord.js'

import JukialClient from '@/client'
import BaseModalSubmit from '@/client/handlers/structures/base-modal-submit'

class ReportUserModalSubmit extends BaseModalSubmit {
  constructor(private readonly client: JukialClient) {
    super('report-user-modal')
  }

  async run(interaction: ModalSubmitInteraction) {
    const id = interaction.customId.replace(this.id, '').trim()

    const user = await this.client.database.user.findOneBy({ id })

    if (!user)
      return interaction.reply({
        content: this.client.i18n.t('profile.not-found', interaction.locale),
        ephemeral: true
      })

    const reason = interaction.fields.getTextInputValue('report-user-input')

    const report = this.client.database.report.create({
      reason,
      user,
      authorId: interaction.user.id
    })
    await this.client.database.report.save(report)

    await interaction.reply({
      content: this.client.i18n.t('report.success', interaction.locale),
      ephemeral: true
    })
  }
}

export default ReportUserModalSubmit
