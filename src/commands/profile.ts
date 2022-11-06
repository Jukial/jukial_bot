import JukialClient from '@/client'
import { BaseCommand } from '@/client/handlers/structures'
import {
  SlashCommandBuilder,
  SlashCommandStringOption,
  ChatInputCommandInteraction,
  EmbedBuilder,
  AutocompleteInteraction,
  ApplicationCommandOptionChoiceData
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

    if (!user || !user.links.length) {
      return interaction.reply({
        content: this.client.i18n.t('profile.not-found', interaction.locale),
        ephemeral: true
      })
    }

    let bio = user.bio ? user.bio.split('\n').slice(0, 6).join('\n') : null
    if (bio !== user.bio) bio = bio.concat('...')

    const embed = new EmbedBuilder()
      .setColor('#FDBA74')
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL({
          extension: 'png',
          size: 128
        })
      })
      .setDescription(bio)
      .addFields({
        name: 'Links',
        value: user.links
          .map((link) => `- [${link.name}](${link.url})`)
          .join('\n')
      })

    await interaction.reply({
      embeds: [embed]
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
