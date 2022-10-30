import { Client, GatewayIntentBits } from 'discord.js'

import Database from './database'

class JukialClient extends Client {
  public database: Database = new Database()

  constructor() {
    super({
      intents: [GatewayIntentBits.Guilds]
    })

    this._start()
  }

  private async _start(): Promise<void> {
    await this.database.login()

    await this.login(process.env.DISCORD_TOKEN)
  }
}

export default JukialClient
