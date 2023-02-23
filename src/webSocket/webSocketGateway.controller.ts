import { ConnectedSocket } from "@nestjs/websockets/decorators/connected-socket.decorator";
import { WebSocketServer } from "@nestjs/websockets/decorators/gateway-server.decorator";
import { MessageBody } from "@nestjs/websockets/decorators/message-body.decorator";
import { WebSocketGateway } from "@nestjs/websockets/decorators/socket-gateway.decorator";
import { SubscribeMessage } from "@nestjs/websockets/decorators/subscribe-message.decorator";
import { OnGatewayConnection } from "@nestjs/websockets/interfaces/hooks/on-gateway-connection.interface";
import { OnGatewayDisconnect } from "@nestjs/websockets/interfaces/hooks/on-gateway-disconnect.interface";
import { Server } from "net";
import { MonitorEvent } from "src/events/monitorEvent";

@WebSocketGateway()
export class SocketsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    
    @WebSocketServer()
    public server: Server;
    
    handleConnection(@ConnectedSocket() client: any, ...args: any[]) {
        console.log(`user ${client.user.id} with socket ${client.id} connected with device ${client.handshake?.query?.deviceId}`);

        // client.join(
        //     getUserDeviceRoom(
        //     client.user.id,
        //     client.handshake.query.deviceId.toString(),
        //     ),
        // );
    }

    handleDisconnect(@ConnectedSocket() client: any) {
        console.log(`user ${client.user.id} with socket ${client.id} with device ${client.handshake?.query?.deviceId} DISCONNECTED`);
        
        // client.leave(
        //     getUserDeviceRoom(
        //         client.user.id,
        //         client.handshake.query.deviceId.toString(),
        //     ),
        // );
    }
    
    @SubscribeMessage(MonitorEvent.SUBSCRIBE_TO_URL.toString())
    subscribeToUrl(@ConnectedSocket() client: any, @MessageBody() body: any): void {
        console.log('subscribeToUrl:', body);
    }

    @SubscribeMessage(MonitorEvent.SUBSCRIBE_TO_TAGS.toString())
    subscribeToTags(@ConnectedSocket() client: any, @MessageBody() body: any): void {
        console.log('subscribeToTags:', body);
    }

}