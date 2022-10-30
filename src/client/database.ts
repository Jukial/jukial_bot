import type { DataSource, Repository } from 'typeorm'

import dataSource from '@/database/data-source'
import { Link } from '@/database/entities/link'
import { User } from '@/database/entities/user'

class Database {
  public source: DataSource

  public user: Repository<User>
  public link: Repository<Link>

  public async login() {
    this.source = await dataSource.initialize()

    this.user = this.source.getRepository(User)
    this.link = this.source.getRepository(Link)
  }
}

export default Database
