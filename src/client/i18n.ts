import { I18NVariables } from '@/utils/types'
import { Collection } from 'discord.js'
import { readdir } from 'fs/promises'
import { join, parse } from 'path'

class I18N {
  private _languages: Collection<string, any> = new Collection()

  public get languages(): Collection<string, any> {
    return this._languages
  }

  constructor() {
    this._loadLanguages()
  }

  private async _loadLanguages() {
    const path = join(__dirname, '../../locales')
    const files = await readdir(path)

    for (const file of files) {
      const lng = await import(join(path, file))
      this._languages.set(parse(file).name, lng)
    }
  }

  public t(
    slug: string,
    language: string = 'en-US',
    variables?: I18NVariables
  ): string {
    const translation = this._getTranslation(
      slug.trim().split('.'),
      this._languages.get(language),
      variables
    )
    return translation || 'UNKNOW'
  }

  private _getTranslation(
    slug: string[],
    language: any,
    variables: I18NVariables = {}
  ): string {
    if (slug.length === 1) {
      let result = language[slug[0]] as string

      if (result) {
        Object.keys(variables).forEach((k) => {
          result = result.replace(`{{${k}}}`, variables[k])
        })
      }

      return result
    } else {
      return this._getTranslation(slug.slice(1), language[slug[0]], variables)
    }
  }
}

export default I18N
