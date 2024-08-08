import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "users" })
export class Users {
  @PrimaryGeneratedColumn({ type: "number" }) // Use number type for generated IDs
  id!: number;

  @Column({ type: "varchar2", length: 255, nullable: false })
  name!: string;

  @Column({ type: "varchar2", length: 255, nullable: false })
  username!: string;

  @Column({ type: "varchar2", length: 255, nullable: false })
  email!: string;

  @Column({ type: "varchar2", length: 255, nullable: true })
  phone!: string | null;

  @Column({ type: "varchar2", length: 255, nullable: false, select: false })
  password!: string;

  @Column({ type: "varchar2", length: 255, nullable: true })
  role_name!: string | null;

  @Column({ type: "varchar2", length: 255, nullable: true })
  master_menu!: string | null;

  @Column({ type: "clob", nullable: true }) // Use CLOB for large text data
  picture!: string | null;

  @Column({ type: "timestamp", nullable: true })
  activated_at!: Date | null;

  @Column({ type: "varchar2", length: 255, nullable: true })
  gender!: string | null;

  @Column({ type: "varchar2", length: 255, nullable: true })
  birth_place!: string | null;

  @Column({ type: "date", nullable: true })
  birth_date!: Date | null;

  @Column({ type: "varchar2", length: 255, nullable: true })
  religion!: string | null;

  @Column({ type: "varchar2", length: 255, nullable: true })
  created_by!: string | null;

  @Column({ type: "varchar2", length: 255, nullable: true })
  updated_by!: string | null;

  @Column({ type: "varchar2", length: 255, nullable: true })
  deleted_by!: string | null;

  @Column({ type: "timestamp", nullable: true })
  created_at!: Date | null;

  @Column({ type: "timestamp", nullable: true })
  updated_at!: Date | null;

  @Column({ type: "timestamp", nullable: true })
  deleted_at!: Date | null;
}
