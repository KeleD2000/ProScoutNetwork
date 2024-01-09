import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';
import * as SockJS from 'sockjs-client';

export const stompConfig: InjectableRxStompConfig = {
  // WebSocket kapcsolat URL-je
  webSocketFactory: () => {
    return new SockJS('http://localhost:8080/ws');
  },
  connectHeaders: {
    // itt adhatsz meg fejléceket, ha szükséges
  },
  heartbeatIncoming: 0, // bejövő ütemjelzések figyelése
  heartbeatOutgoing: 20000, // kimenő ütemjelzések küldése
  reconnectDelay: 5000, // újracsatlakozási késleltetés
  debug: (msg: string): void => {
    console.log(new Date(), msg);
  }
};
