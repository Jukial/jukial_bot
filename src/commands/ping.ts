import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import { BaseCommand } from '@/client/handlers/structures'

class PingCommand extends BaseCommand {
  constructor() {
    const command = new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Ping Pong')
      .setDMPermission(true)

    super(command)
  }

  run(interaction: ChatInputCommandInteraction) {
    interaction.reply({ content: 'Pong Chat' })
  }
}

export default PingCommand
