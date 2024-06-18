const {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
  ManyToOne,
  JoinTable,
  CreateDateColumn,
} = require("typeorm");
import { Post } from "./posts.entity";
// const { Post } = require("./posts.entity");
@Entity({ synchronize: true })
export class UserRegistration extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Unique()
  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  userImg!: string;

  @Column()
  userImgName!: string;

  @CreateDateColumn()
  @Column()
  registeredOn!: Date;

  @OneToMany((type) => Post, (Post) => Post.userRegistration)
  posts: Post[];
}
