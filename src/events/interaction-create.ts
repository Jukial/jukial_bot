import { Events, Interaction } from 'discord.js'

import JukialClient from '@/client'
import { BaseEvent } from '@/client/handlers/structures'

class InteractionCreateEvent extends BaseEvent {
  constructor(private readonly client: JukialClient) {
    super({
      name: Events.InteractionCreate
    })
  }

  async run(interaction: Interaction): Promise<void> {
    if (interaction.isChatInputCommand()) {
      const command = this.client.handler.commands.get(interaction.commandName)
      if (command) await command.run(interaction)
    } else if (interaction.isAutocomplete()) {
      const command = this.client.handler.commands.get(interaction.commandName)
      if (command) await command.autocomplete(interaction)
    } else if (interaction.isUserContextMenuCommand()) {
      const command = this.client.handler.userCommands.get(
        interaction.commandName
      )
      if (command) await command.run(interaction)
    } else if (interaction.isSelectMenu()) {
      const selectMenu = this.client.handler.selectMenus.find((_value, key) =>
        interaction.customId.startsWith(key)
      )
      if (selectMenu) await selectMenu.run(interaction)
    } else if (interaction.isModalSubmit()) {
      const modalSubmit = this.client.handler.modalSubmits.find((_value, key) =>
        interaction.customId.startsWith(key)
      )
      if (modalSubmit) await modalSubmit.run(interaction)
    } else if (interaction.isButton()) {
      const modalSubmit = this.client.handler.buttons.find((_value, key) =>
        interaction.customId.startsWith(key)
      )
      if (modalSubmit) await modalSubmit.run(interaction)
    }
  }
}

export default InteractionCreateEvent
