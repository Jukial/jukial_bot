import 'dotenv/config'
import { REST, Routes } from 'discord.js'
import { extname, join } from 'path'
import { readdir, stat } from 'fs/promises'

import type { BaseCommand } from './client/handlers/structures'

const commands = []

async function loadCommands(dir = './commands'): Promise<void> {
  const path = join(__dirname, dir)

  const files = await readdir(path)

  for (const file of files) {
    const filePath = join(path, file)
    const fileStat = await stat(filePath)

    if (fileStat.isDirectory()) await loadCommands(join(dir, file))
    else if (['.ts', '.js'].includes(extname(file))) {
      const { default: Command } = await import(filePath)
      const instance = new Command() as BaseCommand

      commands.push(instance.command.toJSON())
    }
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN)

async function registerCommands(): Promise<void> {
  try {
    await loadCommands()
    await rest.put(Routes.applicationCommands(process.env.DISCORD_ID), {
      body: commands
    })

    console.log('Successfully reloaded application commands')
  } catch (err) {
    console.error(err)
  }
}

registerCommands()
