import { Events } from 'discord.js'

import type JukialClient from '@/client'
import { BaseEvent } from '@/client/handlers/structures'

class ReadyEvent extends BaseEvent {
  constructor(private readonly client: JukialClient) {
    super({
      name: Events.ClientReady,
      once: true
    })
  }

  run(): void {
    console.log(`${this.client.user.tag} is connected`)
  }
}

export default ReadyEvent
