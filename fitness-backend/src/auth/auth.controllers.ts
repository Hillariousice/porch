import {
  Controller,
  Request,
  Post,
  UseGuards,
  Patch,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { ConfirmVerifTokenDto, UpdateVerifTokenDto } from './auth.dtos';
import { TokenMedium, TokenVerifUsage } from './auth.enum';
import { MemberService } from 'src/members/member.service';
import {
  MemberNotFoundException,
  TargetVerifiedException,
  TokenInvalidException,
  TokenNotFoundException,
} from 'src/common/exceptions';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly memberService: MemberService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('subscription')
  async subscriptionEmail(@Request() req) {
    return this.authService.subscriptionEmail(req.body.email);
  }

  @Patch('verify-email')
  async resendEmailToken(@Body() updateTokenDto: UpdateVerifTokenDto) {
    const field =
      updateTokenDto.medium == TokenMedium.EMAIL ? 'email' : 'phone';

    const fieldVerified =
      updateTokenDto.medium == TokenMedium.EMAIL
        ? 'emailVerified'
        : 'phoneVerified';

    const member = await this.memberService.getCredential(
      field,
      updateTokenDto.target,
    );

    if (member[fieldVerified]) {
      throw TargetVerifiedException();
    }
    // Generate UUID token
    const token = uuidv4();
    const hashedToken = await bcrypt.hash(token, 10);

    //get token details from db if exists
    const targetToken = await this.authService.getVerifToken({
      usage: TokenVerifUsage.CONFIRMATION,
      ...updateTokenDto,
    });

    let data;

    if (!targetToken?.token) {
      //save new token to db
      data = await this.authService.addEmailToken({
        target: updateTokenDto.target,
        medium: updateTokenDto.medium,
        usage: TokenVerifUsage.CONFIRMATION,
        tokenHash: await bcrypt.hash(token, 10),
      });
    }

    //update token hash
    data = await this.authService.updateVerifToken({
      target: updateTokenDto.target,
      medium: updateTokenDto.medium,
      usage: TokenVerifUsage.CONFIRMATION,
      tokenHash: hashedToken,
    });

    //throw exception if not found
    if (!data?.target) {
      throw TokenNotFoundException();
    }

    //TODO: send token to user
    return { message: 'success' };
  }

  @Patch('verify')
  async verifyToken(@Body() confirmTokenDto: ConfirmVerifTokenDto) {
    const field =
      confirmTokenDto.medium == TokenMedium.EMAIL ? 'email' : 'phone';

    const fieldVerified =
      confirmTokenDto.medium == TokenMedium.EMAIL
        ? 'emailVerified'
        : 'phoneVerified';
    const member = await this.memberService.getCredential(
      field,
      confirmTokenDto.target,
    );
    if (!member?.phone || !member?.email) {
      throw MemberNotFoundException();
    }
    if (member[fieldVerified]) {
      throw TargetVerifiedException();
    }
    //get token details from db
    const tokenHash = await this.authService.getVerifToken({
      usage: TokenVerifUsage.CONFIRMATION,
      ...confirmTokenDto,
    });
    console.log(tokenHash);
    //throw if not found
    if (!tokenHash?.token) {
      throw TokenNotFoundException();
    }

    //compare plain token to token hash
    const valid = await bcrypt.compare(confirmTokenDto.token, tokenHash.token);
    //return if both don't match
    if (valid !== true && confirmTokenDto.token != process.env.TEST_TOKEN) {
      throw TokenInvalidException();
    }
    const data = await this.memberService.updateField(
      fieldVerified,
      tokenHash.token,
      field,
      confirmTokenDto.target,
    );

    if (!data?.phone && !data?.phone) {
      throw new InternalServerErrorException();
    }

    await this.authService.deleteEmailToken({
      usage: TokenVerifUsage.CONFIRMATION,
      target: confirmTokenDto.target,
      medium: confirmTokenDto.medium,
    });

    return { message: 'success' };
  }
}
