import { ModalSubmitInteraction } from 'discord.js'

abstract class BaseModalSubmit {
  private _id: string

  public get id(): string {
    return this._id
  }

  constructor(id: string) {
    this._id = id
  }

  abstract run(interaction: ModalSubmitInteraction): any | Promise<any>
}

export default BaseModalSubmit
