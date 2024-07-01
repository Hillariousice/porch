import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export const EmailAlreadyUsedException = () =>
  new ConflictException('email already in use, proceed to verify email');

export const PhoneAlreadyUsedException = () =>
  new ConflictException('phone already in use, proceed to verify phone');

export const VerifiedEmailAlreadyExistsException = () =>
  new ConflictException('verified email already exists');

export const VerifiedPhoneAlreadyExistsException = () =>
  new ConflictException('verified phone already exists');

export const MemberNotFoundException = () =>
  new NotFoundException('member not found');

export const IncorrectLoginCredentialsException = () =>
  new UnauthorizedException('login credentials are incorrect');

export const IncorrectPasswordException = () =>
  new UnauthorizedException('password is incorrect');

export const TokenNotFoundException = () =>
  new NotFoundException('token not found');

export const TokenInvalidException = () =>
  new ForbiddenException('token is invalid or has expired');

export const TargetNotVerifiedException = () =>
  new ForbiddenException('target is not verified');

export const TargetVerifiedException = () =>
  new ForbiddenException('target is already verified');

export const TokenUsageException = () =>
  new ForbiddenException('token has already been used');

export const ProductNotFoundException = () =>
  new NotFoundException('product not found');
