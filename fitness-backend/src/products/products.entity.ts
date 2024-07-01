import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Iso4217 } from './products.enum';

@Entity()
export class Products {
  @PrimaryGeneratedColumn('uuid')
  productId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  images: string[];

  @Column()
  memberId: string;

  @Column()
  categoryId: string;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  sizes: string[];

  @Column({ nullable: true })
  colors: string[];

  @Column({ type: 'enum', enum: Iso4217 })
  currency: Iso4217;

  @Column()
  price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
