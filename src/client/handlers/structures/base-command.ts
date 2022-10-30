import { CommandInteraction, SlashCommandBuilder } from 'discord.js'

abstract class BaseCommand {
  private _command: SlashCommandBuilder

  public get command(): SlashCommandBuilder {
    return this._command
  }

  constructor(command: SlashCommandBuilder) {
    this._command = command
  }

  abstract run(interaction: CommandInteraction): any | Promise<any>
}

export default BaseCommand
