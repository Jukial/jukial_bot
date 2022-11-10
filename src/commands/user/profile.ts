import JukialClient from '@/client'
import { BaseCommand } from '@/client/handlers/structures'
import { getDomainName } from '@/utils/functions'
import { LinkIcon } from '@/utils/types'
import {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  UserContextMenuCommandInteraction,
  ContextMenuCommandBuilder,
  ApplicationCommandType
} from 'discord.js'

class ProfileUserContextCommand extends BaseCommand {
  constructor(private readonly client: JukialClient) {
    const command = new ContextMenuCommandBuilder()
      .setName('profile')
      .setNameLocalizations({
        'en-US': 'profile',
        fr: 'profil'
      })
      .setType(ApplicationCommandType.User)
      .setDMPermission(true)

    super(command)
  }

  async run(interaction: UserContextMenuCommandInteraction) {
    const user = await this.client.database.user.findOne({
      where: {
        id: interaction.targetUser.id
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
}

export default ProfileUserContextCommand
