import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity("user_notifications")
export class UserNotifications {
  @PrimaryGeneratedColumn({ type: "number" })
  id!: number;

  @Column({ type: "varchar2", length: 255, nullable: true })
  username?: string;

  @Column({ type: "number", nullable: false, default: 0 })
  is_read!: number; // 0 for false, 1 for true

  @Column({ type: "varchar2", length: 255, nullable: true })
  title?: string;

  @Column({ type: "clob", nullable: true })
  description?: string;

  @Column({ type: "varchar2", length: 255, nullable: true })
  type?: string;

  @Column({ type: "varchar2", length: 255, nullable: true })
  link_path?: string;

  @Column({ type: "varchar2", length: 255, nullable: true })
  link_params?: string;

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
