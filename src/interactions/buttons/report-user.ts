import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js'

import JukialClient from '@/client'
import { BaseButton } from '@/client/handlers/structures'

class ReportUserButton extends BaseButton {
  constructor(private readonly client: JukialClient) {
    super('report-user-button')
  }

  async run(interaction: ButtonInteraction) {
    const id = interaction.customId.replace(this.id, '').trim()

    const user = await this.client.database.user.findOneBy({ id })

    if (!user)
      return interaction.reply({
        content: this.client.i18n.t('profile.not-found', interaction.locale),
        ephemeral: true
      })

    const modal = new ModalBuilder()
      .setCustomId(`report-user-modal${id}`)
      .setTitle(this.client.i18n.t('report.title', interaction.locale))

    const reason = new TextInputBuilder()
      .setCustomId('report-user-input')
      .setLabel(this.client.i18n.t('report.reason', interaction.locale))
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)

    const row =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
        reason
      )

    modal.setComponents([row])

    await interaction.showModal(modal)
  }
}

export default ReportUserButton
