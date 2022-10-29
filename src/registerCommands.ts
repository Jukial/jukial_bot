import 'dotenv/config'
import { REST, Routes } from 'discord.js'

const commands = []

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN)

async function registerCommands() {
  try {
    await rest.put(Routes.applicationCommands(process.env.DISCORD_ID), {
      body: commands
    })

    console.log('Successfully reloaded application commands')
  } catch (err) {
    console.error(err)
  }
}

registerCommands()
