import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'

import { Link } from './link'

@Entity()
export class User {
  @PrimaryColumn()
  id: string

  @Column({ unique: true })
  username: string

  @OneToMany(() => Link, (link) => link.user)
  links: Link[]
}