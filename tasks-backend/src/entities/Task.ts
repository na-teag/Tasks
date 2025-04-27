import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User.ts";

@Index("task_user_user_id_fk", ["userId"], {})
@Entity("task", { schema: "task" })
export class Task {
  @PrimaryGeneratedColumn({ type: "int", name: "task_id", unsigned: true })
  taskId: number;

  @Column("int", { name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", { name: "title", length: 255 })
  title: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("enum", { name: "status", enum: ["pending", "in progress", "done"] })
  status: "pending" | "in progress" | "done";

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @ManyToOne(() => User, (user) => user.tasks, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;
}
