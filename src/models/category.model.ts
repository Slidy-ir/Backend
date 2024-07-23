import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Template from "./template.model";

@Entity()
class Category {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  title!: string;
  @OneToMany(() => Template, (template) => template.category)
  templates?: Template[];
  @CreateDateColumn()
  created_at!: string;
}
export default Category;
