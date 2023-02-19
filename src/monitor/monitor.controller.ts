import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { SubscribeToUrl } from './types';

@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  // @Get()
  // sendOk(): string { return this.monitorService.sendOk(); }

  @Post('subscribe')
  subscribeToUrl(
    @Body() subscribeToUrl: SubscribeToUrl
  ) {
    const { url, label, frequency } = subscribeToUrl;
    return this.monitorService.subscribeToUrl({ url, label, frequency }); 
  }

  @Post('subscribe-help')
  subscribeToUrlHelp() {
    return this.monitorService.subscribeToUrlHelper();
  }

  @Post('subscribe-list')
  subscribeToUrlList(
    @Body() urls: SubscribeToUrl[]
  ) {
    return this.monitorService.subscribeToUrlList(urls);
  }

  @Post('subscribe-list-help')
  subscribeToUrlListHelp() {
    return this.monitorService.subscribeToUrlListHelper();
  }

  @Delete('unsubscribe')
  unsubscribeFromUrl(@Body() url: string) {
    return this.monitorService.unsubscribeFromUrl(url);
  }

  @Delete('unsubscribe-list')
  unsubscribeFromUrlList(@Body() urls: string[]) {
    return this.monitorService.unsubscribeFromUrlList(urls);
  }

  @Delete('unsubscribe-tags')
  unsubscribeToTags(@Body() tags: string[]) {
    return this.monitorService.unsubscribeToTags(tags);
  }

  @Get('all-subscriptions')
  getAllSubscriptions() {
    return this.monitorService.getAllSubscriptions();
  }

  @Get('urls/active')
  getActiveUrls() {
    return this.monitorService.getActiveUrls();
  }

  @Get('urls/inactive')
  getInactiveUrls() {
    return this.monitorService.getInactiveUrls();
  }

  @Get('urls/activity-history/:label')
  getActivityHistory(@Param('label') label: string) {
    return this.monitorService.getActivityHistory(label);
  }

}
