import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserPurposeOfUse } from "../enums/user.enums";
import { Field, ObjectType } from "type-graphql";
import { hashPassword } from "../utils/authentication";

// Todo -> Add avatar field when the files system is done
// Todo -> Add Trial fields when the subscription is implemented
// Todo -> Add phone and phone_activated field when trial is implemented

@ObjectType()
@Entity()
class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;
  @Field()
  @Column()
  full_name!: string;
  @Field()
  @Column()
  email!: string;
  @Field()
  @Column()
  password!: string;
  @Field()
  @Column({ type: "boolean", default: true })
  is_active!: boolean;
  // User work information
  @Field()
  @Column({ type: "enum", enum: UserPurposeOfUse })
  work_field!: UserPurposeOfUse;
  @Field()
  @Column({ nullable: true })
  job?: string;
  @Field()
  @Column({ nullable: true })
  company_website?: string;
  @Field()
  @Column({ nullable: true })
  company_size?: string;
  @CreateDateColumn()
  created_at!: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async encodePassword() {
    this.password = await hashPassword.pwdToHash(this.password);
  }
}

export default User;
