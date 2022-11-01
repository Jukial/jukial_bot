import {
  Collection,
  ContextMenuCommandBuilder,
  SlashCommandBuilder
} from 'discord.js'
import { readdir, stat } from 'fs/promises'
import { extname, join } from 'path'

import type JukialClient from '..'
import { BaseEvent, BaseCommand } from './structures'
import BaseModalSubmit from './structures/base-modal-submit'
import BaseSelectMenu from './structures/base-select-menu'

class Handler {
  public events: Collection<string, BaseEvent> = new Collection()
  public commands: Collection<string, BaseCommand> = new Collection()
  public userCommands: Collection<string, BaseCommand> = new Collection()
  public selectMenus: Collection<string, BaseSelectMenu> = new Collection()
  public modalSubmits: Collection<string, BaseModalSubmit> = new Collection()

  constructor(private readonly client: JukialClient) {}

  public async start(): Promise<void> {
    const dirs = ['events', 'commands', 'interactions']
    dirs.forEach(async (dir) => await this._loader(dir))
  }

  private async _loader(dir: string): Promise<void> {
    const path = join(__dirname, '../..', dir)

    const files = await readdir(path)

    for (const file of files) {
      const filePath = join(path, file)
      const fileStat = await stat(filePath)

      if (fileStat.isDirectory()) await this._loader(join(dir, file))
      else if (['.ts', '.js'].includes(extname(file))) {
        const { default: Instance } = await import(filePath)
        const instance = new Instance(this.client)

        if (instance instanceof BaseEvent) {
          this.events.set(instance.name, instance)
          if (instance.once) {
            this.client.once(instance.name, instance.run.bind(instance))
          } else {
            this.client.on(instance.name, instance.run.bind(instance))
          }
        } else if (instance instanceof BaseCommand) {
          if (instance.command instanceof SlashCommandBuilder) {
            this.commands.set(instance.command.name, instance)
          } else if (instance.command instanceof ContextMenuCommandBuilder) {
            this.userCommands.set(instance.command.name, instance)
          }
        } else if (instance instanceof BaseSelectMenu) {
          this.selectMenus.set(instance.id, instance)
        } else if (instance instanceof BaseModalSubmit) {
          this.modalSubmits.set(instance.id, instance)
        }
      }
    }
  }
}

export default Handler
