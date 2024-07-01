import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsEnum,
  IsISO4217CurrencyCode,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Iso4217, ProductCategory } from './products.enum';

export class AddProductDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  readonly images: string[];

  @IsNotEmpty()
  @IsString()
  readonly categoryId: string;

  @ArrayNotEmpty()
  readonly sizes: string[];

  @ArrayNotEmpty()
  readonly colors: string[];

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsString()
  @IsISO4217CurrencyCode()
  readonly currency: Iso4217;

  memberId: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @ArrayNotEmpty()
  readonly sizes?: string[];

  @IsOptional()
  @ArrayNotEmpty()
  readonly colors?: string[];

  @IsOptional()
  @IsNumber()
  readonly price?: number;

  @IsOptional()
  @IsString()
  @IsISO4217CurrencyCode()
  readonly currency?: Iso4217;
}

export class FilterProductsDto {
  @IsOptional()
  @IsString()
  memberId?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;
}
