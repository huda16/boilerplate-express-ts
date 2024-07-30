import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "users" })
export class Users {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar2", length: 255, nullable: false })
  firstName!: string;

  @Column({ type: "varchar2", length: 255, nullable: false })
  lastName!: string;

  @Column({ type: "number", nullable: false })
  age!: number;

  @Column({ type: "varchar2", length: 255, nullable: false })
  name!: string;

  @Column({ type: "varchar2", length: 255, nullable: false })
  username!: string;

  @Column({ type: "varchar2", length: 255, nullable: false })
  email!: string;

  @Column({ type: "varchar2", length: 255, nullable: true })
  phone: string | null = null;

  constructor(
    firstName?: string,
    lastName?: string,
    age?: number,
    name?: string,
    username?: string,
    email?: string,
    phone?: string
  ) {
    this.firstName = firstName || "";
    this.lastName = lastName || "";
    this.age = age || 0;
    this.name = name || "";
    this.username = username || "";
    this.email = email || "";
    this.phone = phone !== undefined ? phone : null;
  }
}
