import {
  ContextMenuCommandBuilder,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from 'discord.js'

export interface BaseEventData {
  name: string
  once?: boolean
}

export type BaseCommandType =
  | SlashCommandBuilder
  | SlashCommandSubcommandsOnlyBuilder
  | ContextMenuCommandBuilder
