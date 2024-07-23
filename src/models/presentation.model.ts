import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import User from "./user.model";
import { Field, ObjectType } from "type-graphql";

// Todo -> Add User type when implementing team system
// Todo -> Add owner relation to team when implementing team system
@ObjectType()
@Entity()
class Presentation extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;
  @Field()
  @Column()
  title!: string;
  @Field()
  @Column({ type: "text" })
  content!: string;
  @Field()
  @ManyToOne(() => User, (user) => user.id)
  owner!: number;
  @Field()
  @CreateDateColumn()
  created_at!: string;
  @Field()
  @DeleteDateColumn()
  deleted_at!: string;
  @Field()
  @UpdateDateColumn()
  last_update?: string;
}

export default Presentation;
