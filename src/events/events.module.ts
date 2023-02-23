import { Module } from '@nestjs/common';
import { MonitorModule } from 'src/monitor/monitor.module';
// import { MonitorService } from 'src/monitor/monitor.service';
// import { UrlCheckerService } from 'src/url/url-checker.service';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [
    MonitorModule,
  ],
  providers: [
    EventsGateway//, UrlCheckerService, MonitorService
  ],
})
export class EventsModule {}