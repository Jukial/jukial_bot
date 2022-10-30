import { CommandInteraction } from 'discord.js'

import { BaseCommandType } from '@/utils/types'

abstract class BaseCommand {
  private _command: BaseCommandType

  public get command(): BaseCommandType {
    return this._command
  }

  constructor(command: BaseCommandType) {
    this._command = command
  }

  abstract run(interaction: CommandInteraction): any | Promise<any>
}

export default BaseCommand
