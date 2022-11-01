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

  public t(slug: string, language: string = 'en-US'): string {
    const translation = this._getTranslation(
      slug.trim().split('.'),
      this._languages.get(language)
    )
    return translation || 'UNKNOW'
  }

  private _getTranslation(slug: string[], language: any) {
    if (slug.length === 1) {
      return language[slug[0]]
    } else {
      return this._getTranslation(slug.slice(1), language[slug[0]])
    }
  }
}

export default I18N
