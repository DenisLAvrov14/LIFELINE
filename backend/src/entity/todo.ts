import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id!: number; // Используем !, так как TypeORM сам задаст значение

  @Column()
  title!: string; // Аналогично, TypeORM управляет этим полем

  @Column({ default: false })
  completed!: boolean;
}
