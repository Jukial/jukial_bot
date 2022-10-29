import { Client, GatewayIntentBits } from 'discord.js'

class JukialClient extends Client {
  constructor() {
    super({
      intents: [GatewayIntentBits.Guilds]
    })

    this._start()
  }

  private async _start(): Promise<void> {
    await this.login(process.env.DISCORD_TOKEN)
  }
}

export default JukialClient
