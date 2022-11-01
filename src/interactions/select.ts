import { SelectMenuInteraction } from 'discord.js'

import BaseSelectMenu from '@/client/handlers/structures/base-select-menu'

class Select extends BaseSelectMenu {
  constructor() {
    super('SelectId')
  }

  run(interaction: SelectMenuInteraction) {
    interaction.reply({ content: 'test' })
  }
}

export default Select
