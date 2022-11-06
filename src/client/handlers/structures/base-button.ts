import { ButtonInteraction } from 'discord.js'

abstract class BaseButton {
  private _id: string

  public get id(): string {
    return this._id
  }

  constructor(id: string) {
    this._id = id
  }

  abstract run(interaction: ButtonInteraction): any | Promise<any>
}

export default BaseButton
