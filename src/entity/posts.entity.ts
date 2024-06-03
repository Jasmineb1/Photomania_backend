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
import { UserRegistration } from "./user.entity";

@Entity({ synchronize: true })
@Entity({ synchronize: true })
export class Post {
  @PrimaryGeneratedColumn()
  post_id!: number;

  @Column()
  post_img!: string;

  @Column()
  image_name!: string;

  @Column()
  post_caption!: String;

  @Column()
  post_desc!: string;

  @CreateDateColumn()
  posted_at!: Date;

  @CreateDateColumn()
  upadated_at!: Date;

  @ManyToOne(
    () => UserRegistration,
    (userRegistration) => userRegistration.posts,
    { onDelete: "CASCADE" }
  )
  userRegistration!: UserRegistration;
}
