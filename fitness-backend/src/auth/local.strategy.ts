import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { MemberService } from 'src/members/member.service';
import {
  IncorrectLoginCredentialsException,
  MemberNotFoundException,
  TargetNotVerifiedException,
} from 'src/common/exceptions';
import bcrypt from 'bcrypt';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly memberService: MemberService,
  ) {
    super();
  }
  async validate(phone: string, password: string): Promise<any> {
    const member = await this.memberService.getCredential(phone, password);
    if (!member?.memberId) {
      throw MemberNotFoundException();
    }

    // Check if the user is not verified.
    if (!member.phoneVerified && !member.emailVerified) {
      throw TargetNotVerifiedException();
    }
    // Compare the plain password to the hashed password.
    if (!(await bcrypt.compare(member!.password, password))) {
      throw IncorrectLoginCredentialsException();
    }

    const payload = {
      email: member.email,
      sub: member.memberId,
      phone: member.phone,
      emailVerified: member.emailVerified,
      phoneVerified: member.phoneVerified,
    };
    // Return the member ID and JWT token.
    return { memberId: member.memberId, jwt: this.jwtService.sign(payload) };
  }
}
