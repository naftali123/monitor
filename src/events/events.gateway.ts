import { Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { MonitorService } from 'src/monitor/monitor.service';
import { ActivityHistory } from 'src/url/activityHistory.model';
import { MonitorEvent } from './monitorEvent';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(
    private readonly monitorService: MonitorService,
    private eventEmitter: EventEmitter2
  ) { }

  private logger: Logger = new Logger('EventsGateway');
    

  @WebSocketServer()
  server: Server;
  
  afterInit(server: Server) {
    
    // register events to be listened
    this.eventEmitter.on('activityHistory.updated', (url) => {
      console.log('activityHistory.updated');
      this.server.emit('activityHistory.updated', url.activityHistory[url.activityHistory.length - 1]);
    });
  }


  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(MonitorEvent.SUBSCRIBE_TO_TAGS.toString())
  subscribeToTags(@MessageBody() label: string): Observable<WsResponse<ActivityHistory>> {
    console.log('subscribeToTags', label);
    const response: Observable<{
      event: string;
      data: ActivityHistory;
    }> = from(
      this.monitorService.getActivityHistoryForLabel(label)
    ).pipe(
      map(item => ({ event: MonitorEvent.SUBSCRIBE_TO_TAGS.toString(), data: item }))
    );
    return response;
  }

  @OnEvent('activityHistory.updated')
  handleActivityHistoryUpdated(url: any): void {
    console.log('handleActivityHistoryUpdated');
  }
 
  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}