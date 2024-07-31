import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "authentications" })
export class Authentications {
  @PrimaryGeneratedColumn({ type: "number" })
  id!: number;

  @Column({ type: "clob", nullable: false })
  token!: string;

  constructor(
    token: string,
  ) {
    this.token = token;
  }
}
