import { SelectMenuInteraction } from 'discord.js'

abstract class BaseSelectMenu {
  private _id: string

  public get id(): string {
    return this._id
  }

  constructor(id: string) {
    this._id = id
  }

  abstract run(interaction: SelectMenuInteraction): any | Promise<any>
}

export default BaseSelectMenu
