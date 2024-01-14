import { Injectable } from '@angular/core';
import { Client, StompConfig } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import { MessageDto } from '../model/dto/MessageDto';
import { NotificationsBidDto } from '../model/dto/NotificationsBidDto';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: Client = new Client();
  private messageSubject: Subject<MessageDto> = new Subject<MessageDto>;
  private notificationSubject: Subject<NotificationsBidDto> = new Subject<NotificationsBidDto>;

  constructor() { }

  initializeWebSocketConnection() {
    const stompConfig: StompConfig = {
      webSocketFactory: () => new WebSocket('ws://localhost:8080/ws'),
      debug: (str) => { },
      reconnectDelay: 500,
      onConnect: () => {
        console.log('WebSocket connected');
        const username = localStorage.getItem('isLoggedin');
        const converted = username?.replace(/"/g, '');
        if (converted) {
          setTimeout(() => {
            this.stompClient.subscribe(
              `/queue/private/${converted}`,
              (message) => {;
                this.messageSubject.next(JSON.parse(message.body));
              }
            );
            this.stompClient.subscribe(
              `/queue/notify/${converted}`,
              (message) => {
                this.notificationSubject.next(JSON.parse(message.body));
              }
            )
          }, 1000);
        }
      },
    };
    this.stompClient = new Client(stompConfig);
    this.stompClient.activate();
  }

  sendNotification(message: NotificationsBidDto) {
    this.stompClient.publish({
      destination: `/app/notify/${message.username}`,
      body: JSON.stringify(message),
    });
  }

  getNotifications(): Observable<NotificationsBidDto> {
    return this.notificationSubject.asObservable();
  }

  sendPrivateMessage(message: MessageDto) {
    this.stompClient.publish({
      destination: `/app/chat.sendPrivateMessage/${message.receiverUserId}`,
      body: JSON.stringify(message),
    });
  }

  getMessages(): Observable<MessageDto> {
    return this.messageSubject.asObservable();
  }

}
