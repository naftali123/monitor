import { Module } from '@nestjs/common';
import { UrlCheckerService } from 'src/url/url-checker.service';
import { MonitorController } from './monitor.controller';
import { MonitorService } from './monitor.service';

@Module({
  controllers: [MonitorController],
  providers: [MonitorService, UrlCheckerService],
})
export class MonitorModule {}
