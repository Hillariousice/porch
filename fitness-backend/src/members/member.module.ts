import { forwardRef, Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { MemberCronService } from './membership-cron.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Members } from './member.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Members]),
    forwardRef(() => AuthModule),
    MailModule,
  ],

  controllers: [MemberController],
  providers: [MemberService, MemberCronService],
})
export class MemberModule {}
