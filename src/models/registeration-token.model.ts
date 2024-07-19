import {
  BaseEntity,
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
  @Column({ type: "timestamp without time zone" })
  expire_at?: string;
}

export default RegisterationToken;
