import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Category from "./category.model";

@Entity()
class Template {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  title!: string;
  @ManyToOne(() => Category, (category) => category.templates)
  category!: Category;
  @Column()
  description!: string;
  @Column({ type: "text" })
  content!: string;
  @CreateDateColumn()
  created_at!: string;
}


export default Template