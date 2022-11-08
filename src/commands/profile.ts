import JukialClient from '@/client'
import { BaseCommand } from '@/client/handlers/structures'
import { getDomainName } from '@/utils/functions'
import { LinkIcon } from '@/utils/types'
import {
  SlashCommandBuilder,
  SlashCommandStringOption,
  ChatInputCommandInteraction,
  EmbedBuilder,
  AutocompleteInteraction,
  ApplicationCommandOptionChoiceData,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} from 'discord.js'

class ProfileCommand extends BaseCommand {
  constructor(private readonly client: JukialClient) {
    const usernameOption = new SlashCommandStringOption()
      .setName('username')
      .setNameLocalizations({
        'en-US': 'username',
        fr: 'nom_utilisateur'
      })
      .setDescription('Username of user')
      .setDescriptionLocalizations({
        'en-US': 'Username of user',
        fr: "Nom de l'utilisateur"
      })
      .setRequired(true)
      .setAutocomplete(true)

    const command = new SlashCommandBuilder()
      .setName('profile')
      .setNameLocalizations({
        'en-US': 'profile',
        fr: 'profil'
      })
      .setDescription('Show profile of user')
      .setDescriptionLocalizations({
        'en-US': 'Show profile of user',
        fr: "Affichez le profil de l'utilisateur"
      })
      .setDMPermission(true)
      .addStringOption(usernameOption)

    super(command)
  }

  async run(interaction: ChatInputCommandInteraction) {
    const user = await this.client.database.user.findOne({
      where: {
        username: interaction.options.getString('username', true)
      },
      relations: ['links']
    })

    if (!user || (!user.links.length && !user.bio)) {
      return interaction.reply({
        content: this.client.i18n.t('profile.not-found', interaction.locale),
        ephemeral: true
      })
    }

    let bio = user.bio ? user.bio.split('\n').slice(0, 6).join('\n') : null
    if (bio !== user.bio) bio = bio.concat('...')

    const userAvatar = (
      await this.client.users.fetch(user.id, { cache: true })
    ).displayAvatarURL({ extension: 'png', size: 128 })

    const embed = new EmbedBuilder()
      .setColor('#FDBA74')
      .setAuthor({
        name: user.username,
        iconURL: userAvatar,
        url: `https://discord.com/users/${user.id}`
      })
      .setDescription(bio)

    if (user.links.length) {
      const links = user.links
        .sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
          else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
          else return 0
        })
        .map((link) => {
          const icon =
            LinkIcon[getDomainName(link.url).toUpperCase()] || LinkIcon.DEFAULT
          return `- ${icon} [${link.name}](${link.url})`
        })

      if (links.join('\n').length < 1024) {
        embed.addFields({
          name: this.client.i18n.t('profile.links', interaction.locale),
          value: links.join('\n')
        })
      } else {
        const splitLinks: string[][] = [[]]

        for await (const link of links) {
          const lastLinks = splitLinks[splitLinks.length - 1]
          if (lastLinks.join('\n').length + link.length >= 1024) {
            splitLinks.push([link])
          } else {
            lastLinks.push(link)
          }
        }

        splitLinks.forEach((link, i) => {
          embed.addFields({
            name:
              this.client.i18n.t('profile.links', interaction.locale) +
              ` ${i + 1}`,
            value: link.join('\n'),
            inline: true
          })
        })
      }
    }

    const reportButton = new ButtonBuilder()
      .setCustomId(`report-user-button${user.id}`)
      .setStyle(ButtonStyle.Danger)
      .setLabel(this.client.i18n.t('profile.report', interaction.locale))

    const rowReport = new ActionRowBuilder<ButtonBuilder>().setComponents(
      reportButton
    )

    await interaction.reply({
      embeds: [embed],
      components: [rowReport]
    })
  }

  async autocomplete(interaction: AutocompleteInteraction) {
    const value = interaction.options.getFocused()
    const usernames: ApplicationCommandOptionChoiceData<string>[] =
      this.client.collections.profileUsernames
        .filter((username) => username.startsWith(value))
        .map((username) => ({ name: username, value: username }))
        .slice(0, 25)

    await interaction.respond(usernames)
  }
}

export default ProfileCommand
