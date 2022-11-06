import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateReport1667766435103 implements MigrationInterface {
  name = 'CreateReport1667766435103'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "author_id" character varying NOT NULL, "reason" character varying NOT NULL, "userId" character varying, CONSTRAINT "PK_99e4d0bea58cba73c57f935a546" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "report" ADD CONSTRAINT "FK_e347c56b008c2057c9887e230aa" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "report" DROP CONSTRAINT "FK_e347c56b008c2057c9887e230aa"`
    )
    await queryRunner.query(`DROP TABLE "report"`)
  }
}
