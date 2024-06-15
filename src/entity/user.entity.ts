import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
  ManyToOne,
  JoinTable,
  CreateDateColumn,
} from "typeorm";
import { Post } from "./posts.entity";

@Entity({ synchronize: true })
export class UserRegistration extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  @Column()
  registeredOn!: Date;

  @OneToMany((type) => Post, (Post) => Post.userRegistration) posts: Post[];
}
