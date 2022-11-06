import type { DataSource, Repository } from 'typeorm'

import dataSource from '@/database/data-source'
import { Link } from '@/database/entities/link'
import { User } from '@/database/entities/user'
import { Report } from '@/database/entities/report'

class Database {
  public source: DataSource

  public user: Repository<User>
  public link: Repository<Link>
  public report: Repository<Report>

  public async login(): Promise<void> {
    this.source = await dataSource.initialize()

    this.user = this.source.getRepository(User)
    this.link = this.source.getRepository(Link)
    this.report = this.source.getRepository(Report)
  }
}

export default Database
