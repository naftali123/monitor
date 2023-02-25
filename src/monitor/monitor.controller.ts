import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUrlDto } from 'src/dtos/createUrl.dto';
import { Url } from 'src/url/url.model';
import { MonitorService } from './monitor.service';

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
  @UsePipes(ValidationPipe)
  addUrl(
    @Body() createUrlDto: CreateUrlDto
  ) {
    return this.urlWrapper(this.monitorService.addUrl(createUrlDto));
  }

  @Post('url-help')
  addUrlHelp() {
    return this.monitorService.addUrlHelp();
  }

  @Post('url-list')
  @UsePipes(ValidationPipe)
  addUrlList(
    @Body(new ParseArrayPipe({ items: CreateUrlDto }))
    urls: CreateUrlDto[],
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

  @Get('all-urls/:limit')
  getAllUrls(@Param('limit') limit: number) {
    return this.monitorService.getAllUrls(limit).map((u) =>this.urlWrapper(u));
  }

  @Get('urls/active')
  getActiveUrls() {
    return this.monitorService.getActiveUrls().map((u) =>this.urlWrapper(u));
  }

  @Get('urls/inactive')
  getInactiveUrls() {
    return this.monitorService.getInactiveUrls().map((u) =>this.urlWrapper(u));
  }

  @Get('urls/activity-history/:label/:limit')
  getActivityHistoryForLabel(@Param('label') label: string, @Param('limit') limit: number) {
    return this.monitorService.getActivityHistoryForLabel(label, limit);
  }
}
