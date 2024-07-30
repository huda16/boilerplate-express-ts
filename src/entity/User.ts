import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  age!: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  name!: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  username!: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  email!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
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
