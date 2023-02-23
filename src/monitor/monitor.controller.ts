import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Url } from 'src/url/url.model';
import { MonitorService } from './monitor.service';
import { AddUrlRequest } from './types';

@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  // @Get()
  // sendOk(): string { return this.monitorService.sendOk(); }

  urlWrapper(url: Url | string ): Url | string | Error {
    if(url instanceof Error) {
      return url.message;
    }
    else if(typeof url === 'string') {
      return url;
    }
    return this.monitorService.noIntervalId(url);
  }


  @Post('url')
  addUrl(
    @Body() addUrl: AddUrlRequest 
  ) {
    const { url, label, frequency } = addUrl;
    return this.urlWrapper(this.monitorService.addUrl({ url, label, frequency }));
  }

  @Post('url-help')
  addUrlHelp() {
    return this.monitorService.addUrlHelp();
  }

  @Post('url-list')
  addUrlList(
    @Body() urls: AddUrlRequest[]
  ) {
    return this.monitorService.addUrlList(urls).map((u) =>this.urlWrapper(u));
  }

  @Post('url-list-help')
  addUrlListHelp() {
    return this.monitorService.addUrlListHelp();
  }

  @Delete()
  removeUrl(@Body('url') url: string) { 
    return this.urlWrapper(this.monitorService.removeUrl(url));
  }

  @Delete('list')
  removeUrlList(@Body('urls') urls: string[]) {
    return this.monitorService.removeUrlList(urls).map((u) =>this.urlWrapper(u));
  }

  @Delete('tags')
  removeUrlsByTags(@Body() tags: string[]) {
    return this.monitorService.removeUrlsByTags(tags).map((u) =>this.urlWrapper(u));
  }

  @Get('all-urls')
  getAllUrls() {
    return this.monitorService.getAllUrls().map((u) =>this.urlWrapper(u));
  }

  @Get('urls/active')
  getActiveUrls() {
    return this.monitorService.getActiveUrls().map((u) =>this.urlWrapper(u));
  }

  @Get('urls/inactive')
  getInactiveUrls() {
    return this.monitorService.getInactiveUrls().map((u) =>this.urlWrapper(u));
  }

  @Get('urls/activity-history/:label')
  getActivityHistoryForLabel(@Param('label') label: string) {
    return this.monitorService.getActivityHistoryForLabel(label);
  }
}
