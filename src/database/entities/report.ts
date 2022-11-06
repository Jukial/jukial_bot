import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId
} from 'typeorm'

import { User } from './user'

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.reports, {
    onDelete: 'CASCADE'
  })
  user: User

  @RelationId((report: Report) => report.user)
  userId: User['id']

  @Column({ name: 'author_id' })
  authorId: string

  @Column()
  reason: string
}
