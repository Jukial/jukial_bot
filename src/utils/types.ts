import { ContextMenuCommandBuilder, SlashCommandBuilder } from 'discord.js'

export interface BaseEventData {
  name: string
  once?: boolean
}

export type BaseCommandType = SlashCommandBuilder | ContextMenuCommandBuilder
