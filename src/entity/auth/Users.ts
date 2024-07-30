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
  phone: string | null = null;

  @Column({ type: "varchar2", length: 255, nullable: false })
  password!: string;

  @Column({ type: "varchar2", length: 255, nullable: true })
  role_name: string | null = null;

  @Column({ type: "varchar2", length: 255, nullable: true })
  master_menu: string | null = null;

  @Column({ type: "clob", nullable: true }) // Use CLOB for large text data
  picture: string | null = null;

  @Column({ type: "timestamp", nullable: true })
  activated_at: Date | null = null;

  @Column({ type: "varchar2", length: 255, nullable: true })
  gender: string | null = null;

  @Column({ type: "varchar2", length: 255, nullable: true })
  birth_place: string | null = null;

  @Column({ type: "date", nullable: true })
  birth_date: Date | null = null;

  @Column({ type: "varchar2", length: 255, nullable: true })
  religion: string | null = null;

  @Column({ type: "varchar2", length: 255, nullable: true })
  created_by: string | null = null;

  @Column({ type: "varchar2", length: 255, nullable: true })
  updated_by: string | null = null;

  @Column({ type: "varchar2", length: 255, nullable: true })
  deleted_by: string | null = null;

  @Column({ type: "timestamp", nullable: true })
  created_at: Date | null = null;

  @Column({ type: "timestamp", nullable: true })
  updated_at: Date | null = null;

  @Column({ type: "timestamp", nullable: true })
  deleted_at: Date | null = null;

  constructor(
    name: string,
    username: string,
    email: string,
    password: string,
    phone?: string | null,
    role_name?: string | null,
    master_menu?: string | null,
    picture?: string | null,
    activated_at?: Date | null,
    gender?: string | null,
    birth_place?: string | null,
    birth_date?: Date | null,
    religion?: string | null,
    created_by?: string | null,
    updated_by?: string | null,
    deleted_by?: string | null,
    created_at?: Date | null,
    updated_at?: Date | null,
    deleted_at?: Date | null
  ) {
    this.name = name;
    this.username = username;
    this.email = email;
    this.password = password;
    this.phone = phone || null;
    this.role_name = role_name || null;
    this.master_menu = master_menu || null;
    this.picture = picture || null;
    this.activated_at = activated_at || null;
    this.gender = gender || null;
    this.birth_place = birth_place || null;
    this.birth_date = birth_date || null;
    this.religion = religion || null;
    this.created_by = created_by || null;
    this.updated_by = updated_by || null;
    this.deleted_by = deleted_by || null;
    this.created_at = created_at || null;
    this.updated_at = updated_at || null;
    this.deleted_at = deleted_at || null;
  }
}
