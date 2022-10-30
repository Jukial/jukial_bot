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
    } else if (interaction.isUserContextMenuCommand()) {
      const command = this.client.handler.userCommands.get(
        interaction.commandName
      )
      if (command) await command.run(interaction)
    }
  }
}

export default InteractionCreateEvent
