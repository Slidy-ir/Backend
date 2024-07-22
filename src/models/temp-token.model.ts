import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

export enum TempTokenType {
  REGISTER = "register",
  RESET_PASSWORD = "reset_password",
}

@Entity()
class TempToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  email!: string;
  @Column()
  token!: string;
  @CreateDateColumn()
  created_at!: string;
  @Column({ default: false })
  is_verified!: boolean;
  @Column({ type: "timestamp without time zone" })
  expire_at!: string;
  @Column({ type: "enum", enum: TempTokenType })
  type?: TempTokenType;
  @BeforeInsert()
  async setExpireDate() {
    const date = new Date();
    date.setTime(date.getTime() + 1);
    this.expire_at = date.toString();
  }
}

export default TempToken;
