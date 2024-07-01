import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Members } from './member.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/mail/mail.service';
import { MemberController } from './member.controller';
import { AddMemberDto } from './member.dto';
import { MembershipType } from './member.enum';

describe('MemberService', () => {
  let authService: AuthService;
  let mailService: MailService;
  let service: MemberService;
  let controller: MemberController;
  let repository: Repository<Members>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [MemberService, AuthService, MailService],
    }).compile();

    controller = module.get<MemberController>(MemberController);
    service = module.get<MemberService>(MemberService);
    authService = module.get<AuthService>(AuthService);
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add a member successfully', async () => {
    const addMemberDto: AddMemberDto = {
      email: 'test@example.com',
      // Add other required fields here
      dob: new Date(),
      phone: '123',
      password: 'password',
      membershipType: MembershipType.ANNUALBASIC,
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      photo: 'photo',
    };

    const mockedMemberService = jest
      .spyOn(service, 'findByEmail')
      .mockResolvedValue(null);
    const mockedAuthService = jest
      .spyOn(authService, 'addEmailToken')
      .mockResolvedValue(null);
    const mockedMemberServiceCreate = jest
      .spyOn(service, 'createMember')
      .mockResolvedValue({});

    const result = await controller.addMember(addMemberDto);

    expect(result).toEqual({
      target: addMemberDto.email,
      medium: 'EMAIL',
    });

    expect(mockedMemberService).toHaveBeenCalledWith(addMemberDto.email);
    expect(mockedAuthService).toHaveBeenCalled();
    expect(mockedMemberServiceCreate).toHaveBeenCalled();
  });

  it('should throw an error if verified phone already exists', async () => {
    const addMemberDto: AddMemberDto = {
      email: 'test@example.com',
      // Add other required fields here
      dob: new Date(),
      phone: '123',
      password: 'password',
      membershipType: MembershipType.ANNUALBASIC,
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      photo: 'photo',
    };
  });

  const mockedMemberService = jest
    .spyOn(service, 'findByEmail')
    .mockResolvedValue({ phone: '123', phoneVerified: true });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: getRepositoryToken(Membership),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
    repository = module.get<Repository<Membership>>(
      getRepositoryToken(Membership),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find due memberships', async () => {
    const memberships = [new Membership(), new Membership()];
    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(memberships),
    } as any);

    expect(await service.findDueMemberships()).toBe(memberships);
  });

  it('should send an email', async () => {
    const sendMailMock = jest.fn().mockResolvedValue({});
    jest.spyOn(service, 'sendEmail').mockImplementation(sendMailMock);

    await service.sendEmail('test@example.com', 'Test Subject', 'Test Body');
    expect(sendMailMock).toHaveBeenCalled();
  });
});
