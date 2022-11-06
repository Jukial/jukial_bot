import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  SelectMenuBuilder,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js'

import JukialClient from '@/client'
import { BaseCommand } from '@/client/handlers/structures'
import { User } from '@/database/entities/user'

class LinkCommand extends BaseCommand {
  constructor(private readonly client: JukialClient) {
    const add = new SlashCommandSubcommandBuilder()
      .setName('add')
      .setNameLocalizations({
        'en-US': 'add',
        fr: 'ajouter'
      })
      .setDescription('Add a link on your profile')
      .setDescriptionLocalizations({
        'en-US': 'Add a link on your profile',
        fr: 'Ajoutez un lien sur votre profil'
      })

    const remove = new SlashCommandSubcommandBuilder()
      .setName('delete')
      .setNameLocalizations({
        'en-US': 'delete',
        fr: 'supprimer'
      })
      .setDescription('Delete your links from your profile')
      .setDescriptionLocalizations({
        'en-US': 'Delete your links from your profile',
        fr: 'Supprimez vos liens de votre profile'
      })

    const list = new SlashCommandSubcommandBuilder()
      .setName('list')
      .setNameLocalizations({
        'en-US': 'list',
        fr: 'liste'
      })
      .setDescription('List your links of your profile')
      .setDescriptionLocalizations({
        'en-US': 'List your links of your profile',
        fr: 'Listez vos liens de votre profil'
      })

    const edit = new SlashCommandSubcommandBuilder()
      .setName('edit')
      .setNameLocalizations({
        'en-US': 'edit',
        fr: 'modifier'
      })
      .setDescription('Edit your links of your profile')
      .setDescriptionLocalizations({
        'en-US': 'Edit your links of your profile',
        fr: 'Modifiez vos liens de votre profil'
      })

    const command = new SlashCommandBuilder()
      .setName('link')
      .setNameLocalizations({
        'en-US': 'link',
        fr: 'lien'
      })
      .setDescription('Manage your links')
      .setDescriptionLocalizations({
        'en-US': 'Manage your links',
        fr: 'Gérez vos liens'
      })
      .addSubcommand(add)
      .addSubcommand(remove)
      .addSubcommand(list)
      .addSubcommand(edit)

    super(command)
  }

  async run(interaction: ChatInputCommandInteraction) {
    const subCommand = interaction.options.getSubcommand(true)

    const user = await this.client.database.user.findOne({
      where: {
        id: interaction.user.id
      },
      relations: ['links']
    })

    switch (subCommand) {
      case 'add':
        this.add(interaction, user)
        break
      case 'list':
        this.list(interaction, user)
        break
      case 'delete':
        this.remove(interaction, user)
        break
      case 'edit':
        this.edit(interaction, user)
        break
    }
  }

  async add(interaction: ChatInputCommandInteraction, user: User) {
    if (user && user.links.length === 20) {
      return interaction.reply({
        content: this.client.i18n.t('link.add.limit', interaction.locale),
        ephemeral: true
      })
    }

    const modal = new ModalBuilder()
      .setCustomId('link-add-modal')
      .setTitle(this.client.i18n.t('link.add.title', interaction.locale))

    const urlField = new TextInputBuilder()
      .setCustomId('link-add-url')
      .setLabel('Url')
      .setRequired(true)
      .setStyle(TextInputStyle.Short)

    const nameField = new TextInputBuilder()
      .setCustomId('link-add-name')
      .setLabel(this.client.i18n.t('link.name', interaction.locale))
      .setPlaceholder(
        this.client.i18n.t('link.name-default', interaction.locale)
      )
      .setRequired(false)
      .setStyle(TextInputStyle.Short)

    const urlRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
        urlField
      )
    const nameRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
        nameField
      )

    modal.setComponents([urlRow, nameRow])

    await interaction.showModal(modal)
  }

  async list(interaction: ChatInputCommandInteraction, user: User) {
    if (!user || !user.links.length) {
      const subCmdName = `</${interaction.commandName} add:${interaction.commandId}>`

      return interaction.reply({
        content: this.client.i18n.t('link.error-no-link', interaction.locale, {
          cmd: subCmdName
        }),
        ephemeral: true
      })
    }

    const embed = new EmbedBuilder()
      .setColor('#FDBA74')
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL({
          extension: 'png',
          size: 128
        })
      })
      .setTitle(this.client.i18n.t('link.list.title', interaction.locale))
      .setDescription(
        user.links.map((link) => `- [${link.name}](${link.url})`).join('\n')
      )

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    })
  }

  async remove(interaction: ChatInputCommandInteraction, user: User) {
    if (!user || !user.links.length) {
      const subCmdName = `</${interaction.commandName} add:${interaction.commandId}>`

      return interaction.reply({
        content: this.client.i18n.t('link.error-no-link', interaction.locale, {
          cmd: subCmdName
        }),
        ephemeral: true
      })
    }

    const selectMenu = new SelectMenuBuilder()
      .setCustomId('link-delete-select')
      .setPlaceholder(
        this.client.i18n.t('link.delete.select-placeholder', interaction.locale)
      )
      .setOptions(
        user.links.map((link) => ({
          label: link.name,
          description: link.url,
          value: link.id
        }))
      )

    const row = new ActionRowBuilder<SelectMenuBuilder>().setComponents(
      selectMenu
    )

    await interaction.reply({
      components: [row],
      ephemeral: true
    })
  }

  async edit(interaction: ChatInputCommandInteraction, user: User) {
    if (!user || !user.links.length) {
      const subCmdName = `</${interaction.commandName} add:${interaction.commandId}>`

      return interaction.reply({
        content: this.client.i18n.t('link.error-no-link', interaction.locale, {
          cmd: subCmdName
        }),
        ephemeral: true
      })
    }

    const selectMenu = new SelectMenuBuilder()
      .setCustomId('link-edit-select')
      .setPlaceholder(
        this.client.i18n.t('link.edit.select-placeholder', interaction.locale)
      )
      .setMaxValues(1)
      .setOptions(
        user.links.map((link) => ({
          label: link.name,
          description: link.url,
          value: link.id
        }))
      )

    const row = new ActionRowBuilder<SelectMenuBuilder>().setComponents(
      selectMenu
    )

    await interaction.reply({
      components: [row],
      ephemeral: true
    })
  }
}

export default LinkCommand
