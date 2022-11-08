import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddLengthForLink1667909472868 implements MigrationInterface {
  name = 'AddLengthForLink1667909472868'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "url"`)
    await queryRunner.query(
      `ALTER TABLE "link" ADD "url" character varying(100) NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "name"`)
    await queryRunner.query(
      `ALTER TABLE "link" ADD "name" character varying(50)`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "name"`)
    await queryRunner.query(`ALTER TABLE "link" ADD "name" character varying`)
    await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "url"`)
    await queryRunner.query(
      `ALTER TABLE "link" ADD "url" character varying NOT NULL`
    )
  }
}
