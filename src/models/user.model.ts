import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserPurposeOfUse } from "../enums/user.enums";

// Todo -> Add avatar field when the files system is done
// Todo -> Add Trial fields when the subscription is implemented
// Todo -> Add phone and phone_activated field when trial is implemented

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  full_name?: string;
  @Column()
  email?: string;
  @Column({ type: "time without time zone" })
  password?: string;
  @Column({ type: "boolean", default: false })
  is_active?: boolean;

  // User work information
  @Column({ type: "enum", enum: UserPurposeOfUse })
  work_field?: UserPurposeOfUse;
  @Column({ nullable: true })
  job?: string;
  @Column({ nullable: true })
  company_website?: string;
  @Column({ nullable: true })
  company_size?: string;

  @CreateDateColumn()
  created_at?: boolean;
}

export default User;
