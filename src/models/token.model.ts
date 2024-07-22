import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  BeforeInsert,
} from "typeorm";
import User from "./user.model";

@Entity()
class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  access_token!: string;
  @ManyToOne(() => User, (user) => user.id)
  user!: number;
  @Column({ type: "timestamp without time zone" })
  expire_at!: string;
  @CreateDateColumn()
  created_at!: string;

  @BeforeInsert()
  async setExpireAt() {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    this.expire_at = date.toLocaleString();
  }
}

export default Token;
