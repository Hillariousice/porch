import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TokenVerif {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  target: string;

  @Column()
  medium: string;

  @Column()
  token: string;

  @Column()
  usage: string;
}
