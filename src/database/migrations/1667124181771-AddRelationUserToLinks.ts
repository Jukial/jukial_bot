import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddRelationUserToLinks1667124181771 implements MigrationInterface {
  name = 'AddRelationUserToLinks1667124181771'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "link" ADD "userId" character varying`)
    await queryRunner.query(
      `ALTER TABLE "link" ADD CONSTRAINT "FK_14a562b14bb83fc8ba73d30d3e0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "link" DROP CONSTRAINT "FK_14a562b14bb83fc8ba73d30d3e0"`
    )
    await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "userId"`)
  }
}
