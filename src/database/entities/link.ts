import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId
} from 'typeorm'

import { User } from './user'

@Entity()
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.links, {
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  user: User

  @RelationId((link: Link) => link.user)
  userId: User['id']

  @Column()
  url: string

  @Column({ nullable: true })
  name: string
}
