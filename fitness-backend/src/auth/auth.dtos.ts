import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TokenMedium, TokenVerifUsage } from './auth.enum';
export type AddTokenVerifParams = Readonly<{
  target: string;
  medium: TokenMedium;
  tokenHash: string;
  usage: TokenVerifUsage;
}>;

export type UpdateTokenVerifParams = Readonly<{
  target: string;
  medium: TokenMedium;
  usage: TokenVerifUsage;
  tokenHash: string;
}>;

export type GetTokenParams = Readonly<{
  target: string;
  medium: TokenMedium;
  usage: TokenVerifUsage;
}>;

export type DeleteEmailTokenParams = Readonly<{
  target: string;
  usage: TokenVerifUsage;
  medium: TokenMedium;
}>;

export class UpdateVerifTokenDto {
  @IsNotEmpty()
  @MaxLength(255)
  readonly target: string;

  @IsNotEmpty()
  @IsEnum(TokenMedium)
  readonly medium: TokenMedium;
}

export class ConfirmVerifTokenDto {
  @IsNotEmpty()
  @IsString()
  readonly target: string;

  @IsNotEmpty()
  @IsEnum(TokenMedium)
  readonly medium: TokenMedium;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  readonly token: string;
}

export class SetPasswordDto {
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string;
}

export class AccountRecoveryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly target: string;

  @IsNotEmpty()
  @IsEnum(TokenMedium)
  readonly medium: TokenMedium;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly target: string;

  @IsNotEmpty()
  @IsEnum(TokenMedium)
  readonly medium: TokenMedium;

  @IsString()
  readonly token: string;

  @MinLength(8)
  @IsString()
  readonly password: string;
}

export class ChangePasswordDto {
  @MinLength(8)
  @IsString()
  readonly oldPassword: string;

  @MinLength(8)
  @IsString()
  readonly newPassword: string;
}
