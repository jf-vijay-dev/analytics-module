import { Module } from '@nestjs/common';
import { MailAnalyticsController } from './mail-analytics.controller';
import { MailAnalyticsService } from './mail-analytics.service';

@Module({
  controllers: [MailAnalyticsController],
  providers: [MailAnalyticsService],
})
export class MailAnalyticsModule {}