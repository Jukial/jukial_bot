import { Collection } from 'discord.js'

class Collections {
  private _linkEditIds: Collection<string, string> = new Collection()

  public get linkEditIds(): Collection<string, string> {
    return this._linkEditIds
  }
}

export default Collections
