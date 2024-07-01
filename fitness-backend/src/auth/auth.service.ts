import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MemberService } from '../members/member.service';
import { TokenVerif } from './token-verif.entity';
import {
  AddTokenVerifParams,
  DeleteEmailTokenParams,
  GetTokenParams,
  UpdateTokenVerifParams,
} from './auth.dtos';
import nodemailer from 'nodemailer';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class AuthService {
  constructor(
    private readonly memberService: MemberService,
    private readonly jwtService: JwtService,
    @InjectRepository(TokenVerif)
    private emailRepository: Repository<TokenVerif>,
  ) {}

  async addEmailToken(
    addEmailVerifParams: AddTokenVerifParams,
  ): Promise<TokenVerif> {
    const token = await this.emailRepository.create(addEmailVerifParams);
    await this.emailRepository.save(token);
    return token;
  }
  async subscriptionEmail(userEmail: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_HOST,
        pass: process.env.MAIL_PASS,
      },
    });
    const mailOptions = {
      from: 'hillariousice@gmail.com',
      to: userEmail,
      subject: 'Subscription Confirmation',
      text: 'You have successfully subscribed to our service',
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  async getVerifToken({
    target,
    medium,
    usage,
  }: GetTokenParams): Promise<TokenVerif | null> {
    return await this.emailRepository.findOne({
      where: { target, medium, usage },
    });
  }
  async deleteEmailToken({
    medium,
    target,
    usage,
  }: DeleteEmailTokenParams): Promise<any> {
    return await this.emailRepository.delete({
      medium,
      target,
      usage,
    });
  }
  async updateVerifToken({
    target,
    medium,
    usage,
    tokenHash,
  }: UpdateTokenVerifParams): Promise<any> {
    return await this.emailRepository.update(
      { target, medium, usage },
      { token: tokenHash },
    );
  }
}
