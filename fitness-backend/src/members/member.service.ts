import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Members } from './member.entity';
import { AddMemberDto, UpdateMemberDto } from './member.dto';
import { MembershipStatus, MembershipType } from './member.enum';
import { MailService } from 'src/mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Members)
    private memberRepository: Repository<Members>,
    private emailService: MailService,
  ) {}

  async findAll(): Promise<Members[]> {
    return await this.memberRepository.find();
  }

  async findOne(memberId: string): Promise<Members> {
    return await this.memberRepository.findOneBy({ memberId });
  }

  async createMember(addMemberDto: AddMemberDto): Promise<Members> {
    const startDate = addMemberDto.startDate
      ? new Date(addMemberDto.startDate)
      : new Date();
    let dueDate: Date;

    switch (addMemberDto.membershipType) {
      case MembershipType.ANNUALBASIC:
      case MembershipType.ANNUALPREMIUM:
        dueDate = new Date(startDate);
        dueDate.setFullYear(dueDate.getFullYear() + 1);
        break;
      case MembershipType.MONTHLYBASIC:
      case MembershipType.MONTHLYPREMIUM:
        dueDate = new Date(startDate);
        dueDate.setMonth(dueDate.getMonth() + 1);
        break;
      default:
        throw new Error('Invalid membership type');
    }

    const member: Members = {
      memberId: uuidv4(),
      createdAt: new Date(),
      firstName: addMemberDto.firstName,
      lastName: addMemberDto.lastName,
      membershipType: addMemberDto.membershipType,
      email: addMemberDto.email,
      phone: addMemberDto.phone,
      password: addMemberDto.password,
      dob: addMemberDto.dob,
      address: addMemberDto.address,
      photo: addMemberDto.photo,
      startDate: startDate,
      dueDate: dueDate,
      monthlyDueDate: addMemberDto.monthlyDueDate,
      totalAmount: addMemberDto.totalAmount,
      status: MembershipStatus.ACTIVE,
      isFirstMonth: true, // Set isFirstMonth flag to true for new members
    };

    const savedMember = await this.memberRepository.save(member);

    // Send initial email reminder
    const reminderDate = new Date(dueDate);
    reminderDate.setDate(reminderDate.getDate() - 7);

    // Create email content based on membership type
    const emailContent = {
      to: addMemberDto.email,
      subject: `Porch Membership Reminder - ${addMemberDto.membershipType}`,
      body: `Dear ${addMemberDto.firstName}, your total amount of ${addMemberDto.totalAmount} is due on ${dueDate.toDateString()}. This includes your annual fee and the first month's add-on service charges. Click here for your full invoice.`,
    };

    // Schedule the email (you need to implement scheduling in your email service)
    await this.emailService.sendEmail(emailContent, reminderDate);

    return savedMember;
  }

  async getCredential(
    foo: string,
    bar: string,
  ): Promise<Partial<Members | null>> {
    return await this.memberRepository.findOne({
      where: { [foo]: bar },
      select: [
        'memberId',
        'email',
        'password',
        'emailVerified',
        'phone',
        'phoneVerified',
      ],
    });
  }
  async updateMember(
    memberId: string,
    updateMemberDto: UpdateMemberDto,
  ): Promise<void> {
    if (!memberId) {
      throw new Error('Member ID is required for update.');
    }
    await this.memberRepository.update(memberId, updateMemberDto);
  }

  async deleteMember(memberId: string): Promise<void> {
    await this.memberRepository.delete(memberId);
  }
  async findByEmail(email: string): Promise<Members | undefined> {
    const options: FindOneOptions<Members> = {
      where: { email },
    };
    return await this.memberRepository.findOne(options);
  }

  async findUser(
    field: string,
    key: string,
  ): Promise<Members | null | undefined> {
    return await this.memberRepository.findOne({ [field]: key });
  }

  async updateField(
    foo: string,
    bar: string,
    field: string,
    key: string | boolean,
  ): Promise<any> {
    await this.memberRepository.update({ [foo]: bar }, { [field]: key });
  }

  async findDueMemberships(): Promise<Members[]> {
    const today = new Date();
    const upcomingDueDate = new Date(today);
    upcomingDueDate.setDate(today.getDate() + 7);

    return this.memberRepository
      .createQueryBuilder('membership')
      .where('membership.dueDate <= :upcomingDueDate', {
        upcomingDueDate: upcomingDueDate.toISOString(),
      })
      .orWhere('membership.monthlyDueDate <= :upcomingDueDate', {
        upcomingDueDate: upcomingDueDate.toISOString(),
      })
      .getMany();
  }

  // Method to send an email (uses EmailService)
  async sendEmail(to: string, subject: string, body: string) {
    await this.emailService.sendEmail({ to, subject, body }, new Date());
  }

  async updateMembershipStatus(member: Members, status: MembershipStatus) {
    member.status = status;
    await this.memberRepository.save(member);
  }
}
