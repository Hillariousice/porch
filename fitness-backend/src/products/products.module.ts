import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { Products } from './products.entity';
import { ProductsService } from './products.service';
import { forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { MemberService } from 'src/members/member.service';

@Module({
  imports: [TypeOrmModule.forFeature([Products]), forwardRef(() => AuthModule)],
  controllers: [ProductsController],
  providers: [ProductsService, MemberService],
})
export class ProductsModule {}
