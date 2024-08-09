import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity("master_menus")
export class MasterMenus {
  @PrimaryGeneratedColumn({ type: "number" })
  id!: number;

  @Column({ type: "varchar2", length: 255, nullable: false })
  name?: string;

  @Column({ type: "varchar2", length: 255, nullable: true })
  slug?: string;

  @Column({ type: "json", nullable: true })
  menu_items?: any;

  @Column({ type: "varchar2", length: 255, nullable: true })
  created_by?: string;

  @Column({ type: "varchar2", length: 255, nullable: true })
  updated_by?: string;

  @Column({ type: "varchar2", length: 255, nullable: true })
  deleted_by?: string;

  @CreateDateColumn({ type: "timestamp", nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: "timestamp", nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deleted_at?: Date;
}
