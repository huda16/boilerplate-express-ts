import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAuthentications1722488227519 implements MigrationInterface {
    name = 'AlterAuthentications1722488227519'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "authentications" DROP COLUMN "token"`);
        await queryRunner.query(`ALTER TABLE "authentications" ADD "token" varchar2(512) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "authentications" DROP COLUMN "token"`);
        await queryRunner.query(`ALTER TABLE "authentications" ADD "token" clob NOT NULL`);
    }

}
