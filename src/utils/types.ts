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
  | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
  | ContextMenuCommandBuilder

export interface I18NVariables {
  [key: string]: string
}

export enum LinkIcon {
  GITHUB = '<:github:1039306831723515925>',
  YOUTUBE = '<:youtube:1039306683194822748>',
  TWITTER = '<:twitter:1039306925646553180>',
  FACEBOOK = '<:facebook:1039307026653777920>',
  LINKEDIN = '<:linkedin:1039307130156617800>',
  INSTAGRAM = '<:instagram:1039307303108743258>',
  DEFAULT = ''
}
