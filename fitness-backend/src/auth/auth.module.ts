import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controllers';
import { MemberService } from 'src/members/member.service'; // Check the import path
import { Members } from 'src/members/member.entity'; // Check the import path
import { MailModule } from 'src/mail/mail.module';
import { MemberModule } from 'src/members/member.module';
import { TokenVerif } from './token-verif.entity';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Members, TokenVerif]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' }, // Adjust the expiry time as needed
    }),
    MailModule,
    forwardRef(() => MemberModule), // Handle circular dependency
  ],
  providers: [
    AuthService,
    MemberService,
    JwtStrategy,
    TokenVerif,
    LocalStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService], // Export AuthService if needed
})
export class AuthModule {}
