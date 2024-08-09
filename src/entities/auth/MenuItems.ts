import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity("menu_items")
export class MenuItems {
  @PrimaryGeneratedColumn({ type: "number" })
  id!: number;

  @Column({ type: "varchar2", length: 255, nullable: false })
  name?: string;

  @Column({ type: "varchar2", length: 255, nullable: true })
  slug?: string;

  @Column({ type: "varchar2", length: 255, nullable: true })
  icon?: string;

  @Column({ type: "varchar2", length: 255, nullable: true })
  created_by?: string;

  @Column({ type: "varchar2", length: 255, nullable: true })
  updated_by?: string;

  @Column({ type: "varchar2", length: 255, nullable: true })
  deleted_by?: string;

  @Column({ type: "timestamp", nullable: true })
  created_at?: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at?: Date;

  @Column({ type: "timestamp", nullable: true })
  deleted_at?: Date;
}
