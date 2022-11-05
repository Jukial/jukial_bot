import { Collection } from 'discord.js'

import JukialClient from '.'

class Collections {
  private _linkEditIds: Collection<string, string> = new Collection()
  private _profileUsernames: Collection<string, string> = new Collection()

  public get linkEditIds(): Collection<string, string> {
    return this._linkEditIds
  }

  public get profileUsernames(): Collection<string, string> {
    return this._profileUsernames
  }

  constructor(private readonly client: JukialClient) {}

  public async loadProfileUsernames(): Promise<void> {
    const users = await this.client.database.user.find({
      select: { id: true, username: true }
    })

    for await (const user of users) {
      this.profileUsernames.set(user.id, user.username)
    }

    console.log('Successfully registered profile usernames')
  }
}

export default Collections
