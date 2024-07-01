import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { MembershipStatus, MembershipType } from './member.enum'; // Assuming MembershipStatus and MembershipType are imported correctly

@Entity()
export class Members {
  @PrimaryGeneratedColumn('uuid')
  memberId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  dob?: Date;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  photo?: string;

  @Column({ type: 'enum', enum: MembershipType })
  membershipType: MembershipType;

  @Column({
    type: 'enum',
    enum: MembershipStatus,
    default: MembershipStatus.PENDING,
  })
  status: MembershipStatus;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  dueDate: Date;

  @Column({ nullable: true })
  monthlyDueDate?: Date;

  @Column({ type: 'decimal', nullable: true })
  totalAmount?: number;

  @Column({ type: 'decimal', nullable: true })
  monthlyAmount?: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  token?: string;

  @Column({ type: 'boolean', default: false })
  isFirstMonth?: boolean;

  @Column({ nullable: true })
  invoiceLink?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  emailVerified?: boolean;

  @Column({ type: 'boolean', default: false })
  phoneVerified?: boolean;
}
