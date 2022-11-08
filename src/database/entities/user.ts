import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'

import { Link } from './link'
import { Report } from './report'

@Entity()
export class User {
  @PrimaryColumn()
  id: string

  @Column({ unique: true, length: 40 })
  username: string

  @Column({ length: 200, nullable: true })
  bio?: string

  @OneToMany(() => Link, (link) => link.user)
  links: Link[]

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[]
}
