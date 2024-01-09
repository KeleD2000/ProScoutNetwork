import { ChangeDetectorRef, Component } from '@angular/core';
import { delay } from 'rxjs/operators';
import { FileService } from 'src/app/services/file.service';
import * as AOS from 'aos';
import { MessagesService } from 'src/app/services/messages.service';
import { MessageDto } from 'src/app/model/dto/MessageDto';
import { WebsocketService } from 'src/app/services/websocket.service';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-player-messages',
  templateUrl: './player-messages.component.html',
  styleUrls: ['./player-messages.component.css']
})
export class PlayerMessagesComponent {
  receiverId: number = 0;
  senderUsernameByWebSocket: string = '';
  senderIdByWebSocket: number = 0;
  receiverUsernameByWebSocket: string = '';
  senderProfPic: string = '';
  isItMessages: boolean = false;
  image: any;
  message: string = '';
  rightNow: boolean = false;
  senderUser?: User;
  combinedMessages: any[] = [];
  senderArray: any[] = [];
  senderObject: any = {};
  sendMessageArray: any[] = [];
  receiverMessageArray: any[] = [];

  constructor(private messageService: MessagesService, private fileService: FileService,
    private websocketService: WebsocketService, private changeDetector: ChangeDetectorRef,) { }

  ngOnInit() {

    setInterval(() => {
      this.changeDetector.detectChanges();
    }, 60000);

    console.log(this.senderUser);
    this.websocketService.initializeWebSocketConnection();
    const username = localStorage.getItem('isLoggedin');
    let current = username?.replace(/"/g, '');
    if (current) {
      this.senderUsernameByWebSocket = current;
    }

    this.fileService.getCurrentUser(current).subscribe((prof) => {
      for (const [key, value] of Object.entries(prof)) {
        if (key === 'id') {
          this.receiverId = value;
          this.getSendersWithDelay();
        }
      }
    });

    this.websocketService.getMessages().subscribe((mess: MessageDto) => {
      console.log(mess);
      let sendMessageObject = {
        id: mess.id,
        date_time: mess.timestamp,
        content: mess.message_content,
        sender_username: mess.senderUsername,
        user_type: 'sent',
        image: ""
      };
      this.fileService.getProfilePicBlob(sendMessageObject.sender_username).subscribe(
        (response: any) => {
          if (response) {
            const reader = new FileReader();
            reader.onload = () => {
              sendMessageObject.image = reader.result as string;
              this.combinedMessages.push(sendMessageObject);
              console.log(this.combinedMessages);
            };
            reader.readAsDataURL(new Blob([response], { type: 'image/png' }));
          }
        },
        (error) => {
          console.error('Error fetching profile picture:', error);
        }
      );
    });
  }

  getMessages(senderId: number) {
    this.senderIdByWebSocket = senderId;

    this.messageService.getMessages(senderId, this.receiverId).subscribe(async (mess) => {
      let messagePromises = mess.map(async (message: any) => {
        const sender_username = message.senderUser.username;
        this.receiverUsernameByWebSocket = sender_username;
        const image = await this.loadImage(sender_username); // Betöltjük a képet
        
        return {
          timestamp: new Date(message.timestamp),
          content: message.message_content,
          sender_username: sender_username,
          receiver_username: this.senderUsernameByWebSocket,
          user_type: message.senderUser.id === this.receiverId ? 'received' : 'sent',
          image: image
        };
      });

      // Várunk az összes kép betöltésére
      this.combinedMessages = await Promise.all(messagePromises);
      this.combinedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      this.isItMessages = true;
    });
  }

  // Segédfüggvény a kép betöltésére
  private loadImage(username: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.fileService.getProfilePicBlob(username).subscribe(
        (response: any) => {
          if (response) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(new Blob([response], { type: 'image/png' }));
          }
        },
        (error) => {
          console.error('Error fetching profile picture:', error);
          reject(error);
        }
      );
    });
  }


  getSendersWithDelay() {
    this.messageService.getSenders(this.receiverId)
      .pipe(
        delay(1000)
      )
      .subscribe((receiver) => {
        for (let i in receiver) {
          console.log(receiver[i]);
          const senderObject: any = {
            id: receiver[i].id,
            name: receiver[i].username,
            content: receiver[i].message_content,
            timestamp: receiver[i].timestamp,
            image: ""
          };

          this.fileService.getProfilePicBlob(senderObject.name).subscribe(
            (response: any) => {
              if (response) {
                const reader = new FileReader();
                reader.onload = () => {
                  senderObject.image = reader.result as string;
                };
                reader.readAsDataURL(new Blob([response], { type: 'image/png' }));
              }
            },
            (error) => {
              console.error('Error fetching profile picture:', error);
            }
          );

          this.senderArray.push(senderObject);
        }

        console.log(this.senderArray);
      });

  }

  sendMessage() {
    // Az időt most adjuk hozzá, itt azonosítási céllal
    const currentDateTime = new Date();


    const messageToSend: MessageDto = {
      message_content: this.message,
      timestamp: currentDateTime,
      senderUsername: this.senderUsernameByWebSocket,
      receiverUsername: this.receiverUsernameByWebSocket,
      readed: false,
      senderUserId: this.receiverId,
      receiverUserId: this.senderIdByWebSocket,
    };
    this.message = '';
    this.websocketService.sendPrivateMessage(messageToSend);
    this.addMessageToChat(messageToSend);
  }

  addMessageToChat(message: MessageDto) {
    const chatMessage = {
      timestamp: new Date(),
      content: message.message_content,
      sender_username: message.senderUsername,
      user_type: 'received',
      image: ""
    };

    this.fileService.getProfilePicBlob(message.senderUsername).subscribe(
      (response: any) => {
        if (response) {
          const reader = new FileReader();
          reader.onload = () => {
            chatMessage.image = reader.result as string;
          };
          reader.readAsDataURL(new Blob([response], { type: 'image/png' }));
        }
      },
      (error) => {
        console.error('Error fetching profile picture:', error);
      }
    );


    this.combinedMessages.push(chatMessage);
    this.combinedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  calculateElapsedTime(timestamp: Date): string {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = now.getTime() - then.getTime();

    const minutes = Math.floor(diff / 60000); // milliszekundumok percben

    if (minutes < 5) {
        return "Éppen most";
    } else if (minutes < 60) {
        return `${minutes} perc ezelőtt`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours} óra ezelőtt`;
    }

    const days = Math.floor(hours / 24);
    return `${days} nap ezelőtt`;
}


  ngAfterViewInit() {
    AOS.init({
      once: true
    });
  }
}
