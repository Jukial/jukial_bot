import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddBioToUser1667735727025 implements MigrationInterface {
  name = 'AddBioToUser1667735727025'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "bio" character varying(200)`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bio"`)
  }
}
