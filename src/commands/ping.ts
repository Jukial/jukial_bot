import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  SelectMenuBuilder,
  SlashCommandBuilder
} from 'discord.js'

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
    const selectMenu = new SelectMenuBuilder()
      .setCustomId('SelectId')
      .setPlaceholder('Select Test')
      .addOptions({
        label: 'Test',
        description: 'Test',
        value: 'Test'
      })

    const components = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
      selectMenu
    )
    interaction.reply({ content: 'Pong Chat', components: [components] })
  }
}

export default PingCommand
