import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { AddMemberDto, MemberPayload, UpdateMemberDto } from './member.dto';
import {
  EmailAlreadyUsedException,
  PhoneAlreadyUsedException,
  VerifiedEmailAlreadyExistsException,
  VerifiedPhoneAlreadyExistsException,
} from 'src/common/exceptions';
import * as bcrypt from 'bcrypt';
import { Member } from './members.decorator';
import { TokenMedium, TokenVerifUsage } from '../auth/auth.enum';
import { AuthService } from '../auth/auth.service';
import { MailService } from 'src/mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { MemberCronService } from './membership-cron.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('members')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly memberCronService: MemberCronService,
  ) {}

  @Post()
  async addMember(@Body() addMemberDto: AddMemberDto) {
    const data = await this.memberService.findByEmail(addMemberDto.email);

    //return if verified phone already exists
    if (data?.phone && data?.phoneVerified) {
      throw VerifiedPhoneAlreadyExistsException();
    }

    //throw if phone exists but not verified
    if (data?.phone && !data.phoneVerified) {
      throw PhoneAlreadyUsedException();
    }

    //return if verified email already exists
    if (data?.email && data?.emailVerified) {
      throw VerifiedEmailAlreadyExistsException();
    }

    //throw if email exists but not verified
    if (data?.phone && !data.phoneVerified) {
      throw EmailAlreadyUsedException();
    }
    //hash password
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(addMemberDto.password, salt);
    addMemberDto.password = hash;

    const member = await this.memberService.createMember(addMemberDto);
    if (!member) {
      throw new InternalServerErrorException('could not create member');
    }

    // Generate UUID token
    const token = uuidv4();
    const hashedToken = await bcrypt.hash(token, 10);

    // Save hashed token
    await this.authService.addEmailToken({
      target: addMemberDto.email,
      medium: TokenMedium.EMAIL,
      usage: TokenVerifUsage.CONFIRMATION,
      tokenHash: hashedToken,
    });

    return member;
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllMembers() {
    return await this.memberService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getMember(memberId: string) {
    return await this.memberService.findOne(memberId);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateMember(
    @Body() updateMemberDto: UpdateMemberDto,
    @Param('id') memberId: string,
  ) {
    if (!memberId) {
      throw new HttpException(
        'Member ID is required for update.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      message: 'Member updated successfully',
      data: await this.memberService.updateMember(memberId, updateMemberDto),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteMember(@Member() { memberId }: MemberPayload) {
    return {
      message: 'member deleted successfully',
      data: await this.memberService.deleteMember(memberId),
    };
  }
  @Get('trigger')
  async triggerCron() {
    try {
      await this.memberCronService.handleCron();
      return { message: 'Cron job triggered successfully' };
    } catch (error) {
      throw new HttpException(
        'Cron job failed to execute',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('due/memberships')
  async findDueMemberships() {
    return await this.memberService.findDueMemberships();
  }

  @Post('send-email')
  async sendEmail(
    @Body() sendEmailDto: { to: string; subject: string; text: string },
  ) {
    try {
      await this.memberService.sendEmail(
        sendEmailDto.to,
        sendEmailDto.subject,
        sendEmailDto.text,
      );
      return { message: 'Email sent successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Could not send email');
    }
  }
}
