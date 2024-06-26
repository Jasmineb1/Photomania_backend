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
import { UserRegistration } from "./user.entity";
// const { UserRegistration } = require("./user.entity");
@Entity({ synchronize: true })
export class Post {
  @PrimaryGeneratedColumn()
  postId!: number;

  @Column()
  postImg!: string;

  @Column()
  imageName!: string;

  @Column()
  postCaption!: String;

  @Column()
  postDesc!: string;

  @CreateDateColumn()
  postedAt!: Date;

  @CreateDateColumn()
  upadatedAt!: Date;

  @ManyToOne(
    () => UserRegistration,
    (userRegistration) => userRegistration.posts,
    { onDelete: "CASCADE" }
  )
  userRegistration!: UserRegistration;
}
