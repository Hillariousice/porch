import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Member = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const member = request.member;
    return data ? member?.[data] : member;
  },
);
