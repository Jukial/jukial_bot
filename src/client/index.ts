import { Client, GatewayIntentBits } from 'discord.js'

import Database from './database'
import Handler from './handlers'

class JukialClient extends Client {
  public database: Database = new Database()
  public handler: Handler = new Handler(this)

  constructor() {
    super({
      intents: [GatewayIntentBits.Guilds]
    })

    this._start()
  }

  private async _start(): Promise<void> {
    await this.database.login()
    await this.handler.start()

    await this.login(process.env.DISCORD_TOKEN)
  }
}

export default JukialClient
