import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { MailAnalyticsService } from './mail-analytics.service';
import { MailAnalyticsInputDto } from './input-dto/input.dto';

@Controller('categorize')
export class MailAnalyticsController {
  constructor(private readonly analyticsService: MailAnalyticsService) {}

  /**
     * @description This function is used to detect spam mails, if not spam then categorize them into different categories, namely: Promotions, Social, Primary
     * @param mailData
     * @returns boolean
     */
  @Post('mail')
  async categorizeMail(@Body() mailData: MailAnalyticsInputDto) {
    let category: string;
    category = await this.analyticsService.categorize(mailData);
    if(category == "") throw new HttpException("Error in categorizing mail", 500);
    return category;
  }
}