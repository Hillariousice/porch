import { MembershipType } from './member.enum';
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsDate,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
export class AddMemberDto {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  @IsString()
  readonly membershipType: MembershipType;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  readonly dob?: Date;

  @IsString()
  @IsOptional()
  readonly address?: string;

  @IsString()
  @IsOptional()
  readonly photo?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dueDate?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  monthlyDueDate?: Date;

  @IsNumber()
  @IsOptional()
  totalAmount?: number;
}

export class UpdateMemberDto extends AddMemberDto {}

export type MemberPayload = Readonly<{
  email: string;
  memberId: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}>;

export class LoginDto {
  email: string;
  password: string;
}
