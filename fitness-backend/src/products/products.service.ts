import { Injectable } from '@nestjs/common';
import {
  AddProductDto,
  FilterProductsDto,
  UpdateProductDto,
} from './products.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './products.entity';
import { Repository } from 'typeorm';
import { MemberService } from 'src/members/member.service';
import { MemberNotFoundException } from 'src/common/exceptions';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productModel: Repository<Products>,
    private readonly memberService: MemberService,
  ) {}

  async addProduct(addProductDto: AddProductDto) {
    const product: Products = {
      memberId: addProductDto.memberId,
      productId: uuidv4(),
      name: addProductDto.name,
      description: addProductDto.description,
      price: addProductDto.price,
      categoryId: addProductDto.categoryId,
      sizes: addProductDto.sizes,
      images: addProductDto.images,
      colors: addProductDto.colors,
      currency: addProductDto.currency,
      createdAt: new Date(),
      quantity: 0,
    };
    return await this.productModel.save(product);
  }

  async getProducts(filterProductsDto: FilterProductsDto) {
    return await this.productModel.findOneBy({ ...filterProductsDto });
  }

  async getMarchantProducts(memberId: string) {
    return await this.productModel.findOneBy({ memberId });
  }

  async getProductById(productId: string) {
    return await this.productModel.findOneBy({ productId });
  }

  async updateProduct(
    productId: string,
    memberId: string,
    updateProductDto: UpdateProductDto,
  ) {
    const member = await this.memberService.findOne(memberId);
    if (!member) {
      throw MemberNotFoundException();
    }
    const { currency, ...rest } = updateProductDto;
    return await this.productModel.update({ productId }, { ...rest });
  }

  async deleteProduct(productId: string, memberId: string) {
    const member = await this.memberService.findOne(memberId);
    if (!member) {
      throw MemberNotFoundException();
    }
    return await this.productModel.delete({ productId });
  }
}
