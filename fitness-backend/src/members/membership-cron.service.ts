import { Injectable } from '@nestjs/common';
import { MemberService } from './member.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MemberCronService {
  constructor(private readonly memberService: MemberService) {}

  // Use NestJS's built-in cron decorator to schedule the task
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    const memberships = await this.memberService.findDueMemberships();
    const today = new Date();

    for (const member of memberships) {
      const dueDate = new Date(member.dueDate);
      if (isNaN(dueDate.getTime())) continue;

      const reminderDate = new Date(member.dueDate);
      reminderDate.setDate(reminderDate.getDate() - 7);

      const todayStr = today.toISOString().split('T')[0];
      const reminderDateStr = reminderDate.toISOString().split('T')[0];

      if (member.isFirstMonth && todayStr === reminderDateStr) {
        await this.memberService.sendEmail(
          member.email,
          `Porch Membership Reminder - ${member.membershipType}`,
          `Dear ${member.firstName},\n\nYour annual membership fee of ${member.totalAmount} and the first month's add-on service charges are due soon.\n\nBest Regards,\nFitness+`,
        );
      } else {
        const currentMonth = today.getMonth();
        const dueMonth = new Date(member.monthlyDueDate).getMonth();

        if (!member.isFirstMonth && currentMonth === dueMonth) {
          await this.memberService.sendEmail(
            member.email,
            `Porch Add-on Service Reminder - ${member.membershipType}`,
            `Dear ${member.firstName},\n\nYour monthly add-on service charges of ${member.totalAmount} are due soon.\n\nBest Regards,\nFitness+`,
          );
        }
      }
    }
  }
}
