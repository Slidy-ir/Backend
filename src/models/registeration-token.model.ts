import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

// Todo -> Add pre save method to set the expire at

@Entity()
class RegisterationToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  email?: string;
  @Column()
  token?: string;
  @CreateDateColumn()
  created_at?: string;
  @Column({ default: false })
  is_verified!: boolean;
  @Column({ type: "timestamp without time zone" })
  expire_at?: string;

  @BeforeInsert()
  async setExpireDate() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    this.expire_at = date.toString();
  }
}

export default RegisterationToken;
