import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  UserContextMenuCommandInteraction
} from 'discord.js'

import { BaseCommand } from '@/client/handlers/structures'

class PingUserCommand extends BaseCommand {
  constructor() {
    const command = new ContextMenuCommandBuilder()
      .setName('ping')
      .setType(ApplicationCommandType.User)

    super(command)
  }

  run(interaction: UserContextMenuCommandInteraction) {
    interaction.reply({ content: 'Pong User' })
  }
}

export default PingUserCommand
