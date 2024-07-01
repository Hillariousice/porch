import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  MemberNotFoundException,
  ProductNotFoundException,
} from 'src/common/exceptions';

import {
  AddProductDto,
  UpdateProductDto,
  FilterProductsDto,
} from './products.dto';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Member } from 'src/members/members.decorator';
import { MemberPayload } from 'src/members/member.dto';
import { MemberService } from 'src/members/member.service';

export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly memberService: MemberService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addProduct(
    @Body() addProductDto: AddProductDto,
    @Member() { memberId }: MemberPayload,
  ) {
    const member = await this.memberService.findOne(memberId);
    if (!member) {
      throw MemberNotFoundException();
    }
    return await this.productsService.addProduct(addProductDto);
  }

  @Get()
  async getProducts(@Query() filterProductsDto: FilterProductsDto) {
    return await this.productsService.getProducts(filterProductsDto);
  }

  @Patch(':productId')
  @UseGuards(JwtAuthGuard)
  async updateProduct(
    @Body() updateProduct: UpdateProductDto,
    @Member() { memberId }: MemberPayload,
    @Param('productId') productId: string,
  ) {
    const product = await this.productsService.updateProduct(
      productId,
      memberId,
      updateProduct,
    );

    if (!product) throw ProductNotFoundException();

    return product;
  }

  @Delete(':productId')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(
    @Member() { memberId }: MemberPayload,
    @Param('productId') productId: string,
  ) {
    const product = await this.productsService.deleteProduct(
      productId,
      memberId,
    );
    if (!product) throw ProductNotFoundException();

    return product;
  }
}
