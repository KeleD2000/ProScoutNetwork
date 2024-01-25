import { Injectable } from '@angular/core';
import { Client, StompConfig } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import { MessageDto } from '../model/dto/MessageDto';
import { NotificationsBidDto } from '../model/dto/NotificationsBidDto';
import { ReportDto } from '../model/dto/ReportDto';
import { BidDto } from '../model/dto/BidDto';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: Client = new Client();
  private messageSubject: Subject<MessageDto> = new Subject<MessageDto>;
  private messageGroupSubject: Subject<MessageDto> = new Subject<MessageDto>;
  private notificationSubject: Subject<NotificationsBidDto> = new Subject<NotificationsBidDto>;
  private reportSubject: Subject<ReportDto> = new Subject<ReportDto>;
  private bidSubject: Subject<BidDto> = new Subject<BidDto>;

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
            );
            this.stompClient.subscribe(
              `/queue/group/${converted}`,
              (message) => {
                this.messageGroupSubject.next(JSON.parse(message.body));
              }
            );
            this.stompClient.subscribe(
              `/queue/report/${converted}`,
              (message) => {
                this.reportSubject.next(JSON.parse(message.body));
              }
            );
            this.stompClient.subscribe(
              `/queue/bid/${converted}`,
              (message) => {
                this.bidSubject.next(JSON.parse(message.body));
              }
            );
          }, 1000);
        }
      },
    };
    this.stompClient = new Client(stompConfig);
    this.stompClient.activate();
  }

  sendBid(message: BidDto){
    this.stompClient.publish({
      destination: `/app/report/${message.receiverUserId}`,
      body: JSON.stringify(message),
    });
  }

  getBids(): Observable<BidDto> {
    return this.bidSubject.asObservable();
  }

  sendReport(message: ReportDto) {
    this.stompClient.publish({
      destination: `/app/report/${message.receiverUserId}`,
      body: JSON.stringify(message),
    });
  }

  getReports(): Observable<ReportDto> {
    return this.reportSubject.asObservable();
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

  sendGroupMessage(message: MessageDto){
    this.stompClient.publish({
      destination: `/app/chat.sendPrivateMessageToUsers/${message.receiverUserId}/${message.anotherReceiverUserId}`,
      body: JSON.stringify(message),
    });
  }

  getGroupMessage(): Observable<MessageDto> {
    return this.messageGroupSubject.asObservable();
  }

}
