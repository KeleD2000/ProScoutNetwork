import { ChangeDetectorRef, Component, NgZone, Renderer2 } from '@angular/core';
import { delay } from 'rxjs/operators';
import { FileService } from 'src/app/services/file.service';
import * as AOS from 'aos';
import { MessagesService } from 'src/app/services/messages.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { MessageDto } from 'src/app/model/dto/MessageDto';
import { WebsocketService } from 'src/app/services/websocket.service';
import { User } from 'src/app/model/User';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-player-messages',
  templateUrl: './player-messages.component.html',
  styleUrls: ['./player-messages.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class PlayerMessagesComponent {
  receiverId: number = 0;
  senderUsernameByWebSocket: string = '';
  senderIdByWebSocket: number = 0;
  receiverUsernameByWebSocket: string = '';
  senderProfPic: string = '';
  selectedPlatform: string = '';
  showModal: boolean = false;
  modalTitle: string = '';
  isItMessages: boolean = false;
  image: any;
  message: string = '';
  searchMessage: string = '';
  rightNow: boolean = false;
  searchUsername: string = '';
  theSearcherIsScout: boolean = false;
  theSearcherIsPlayer: boolean = false;
  isHasSender: boolean = false;
  searchUserId: number = 0;
  senderUser?: User;
  combinedMessages: any[] = [];
  senderArray: any[] = [];
  senderObject: any = {};
  sendMessageArray: any[] = [];
  receiverMessageArray: any[] = [];

  constructor(private messageService: MessagesService, private fileService: FileService,
    private websocketService: WebsocketService, private changeDetector: ChangeDetectorRef,
    private renderer: Renderer2, private route: ActivatedRoute, private router: Router,
    private ngZone: NgZone
    ) { }

  ngOnInit() {
    const keyExistsScout = this.checkLocalStorageForKey('isScout');
    const keyExistsPlayer = this.checkLocalStorageForKey('isPlayer');

    if (keyExistsScout) {
      this.theSearcherIsScout = true;
    } else if (keyExistsPlayer) {
      this.theSearcherIsPlayer = true;
    }

    this.route.queryParams.subscribe(params => {
      this.searchUsername = params['name'];
      this.searchUserId = params['id'];
    });

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
        image: "assets/not-found.jpg"
      };
      this.fileService.getProfilePicBlob(sendMessageObject.sender_username).subscribe(
        (response: any) => {
          if (response) {
            const reader = new FileReader();
            reader.onload = () => {
              sendMessageObject.image = reader.result as string;

            };
            reader.readAsDataURL(new Blob([response], { type: 'image/png' }));
          }
        },
        (error) => {
          console.error('Error fetching profile picture:', error);
        }
      );
      this.combinedMessages.push(sendMessageObject);
      console.log(this.combinedMessages);
      this.ngZone.run(() => {
        this.changeDetector.detectChanges();
      });
    });
  }

  checkLocalStorageForKey(key: string): boolean {
    return localStorage.getItem(key) !== null;
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
          resolve('assets/not-found.jpg');
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
            image: "assets/not-found.jpg"
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
          console.log(senderObject);

          this.senderArray.push(senderObject);
        }

        console.log(this.senderArray);
        if(this.senderArray.length === 0){
          this.isHasSender = true;
        }
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
      image: "assets/not-found.jpg"
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

  sendMessageFromSearch(text: string) {
    // Az időt most adjuk hozzá, itt azonosítási céllal
    const currentDateTime = new Date();


    console.log(this.message);
    const messageToSend: MessageDto = {
      message_content: text,
      timestamp: currentDateTime,
      senderUsername: this.senderUsernameByWebSocket,
      receiverUsername: this.searchUsername,
      senderUserId: this.receiverId,
      receiverUserId: this.searchUserId,
    };
    console.log(messageToSend);

    this.websocketService.sendPrivateMessage(messageToSend);
    this.addMessageToChatFromSearch(messageToSend);
    if(this.theSearcherIsPlayer){
      this.router.navigate(['/player-message']);
    }else if(this.theSearcherIsScout){
      this.router.navigate(['/scout-message']);
    }
 
  }

  addMessageToChatFromSearch(message: MessageDto) {
    const chatMessage = {
      timestamp: new Date(),
      content: message.message_content,
      sender_username: message.senderUsername,
      user_type: 'received',
      image: ""
    };

    this.combinedMessages.push(chatMessage);
    this.combinedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  calculateElapsedTime(timestamp: Date): string {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = now.getTime() - then.getTime();
  
    if (isNaN(diff)) {
      return "Éppen most";
    }
  
    const minutes = Math.floor(diff / 60000); // milliszekundumok percben
    for (let i in this.senderArray) {
      if (minutes < 5) {
        return "Éppen most";
      } else if (minutes < 60) {
        return `${minutes} perccel ezelőtt`;
      }
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} órával ezelőtt`;
    }
    const days = Math.floor(hours / 24);
    return `${days} nappal ezelőtt`;
  }  

  openSweetAlertOnLoad() {
    this.route.queryParams.subscribe(params => {
      const name = params['name'];
      const id = params['id'];

      if (name && id) {
        this.showSweetAlert();
      }
    });
  }

  async showSweetAlert(){
    const { value: text, isConfirmed } = await Swal.fire({
      input: "textarea",
      inputLabel: `Üzenet küldés ${this.searchUsername} felhasználónak`,
      inputPlaceholder: "Ide írja az üzenetét...",
      inputAttributes: {
        "aria-label": "Ide írja az üzenetét..."
      },
      showCancelButton: true,
      confirmButtonText: 'Küldés',  
      cancelButtonText: 'Mégsem', 
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-success',  
        cancelButton: 'btn btn-danger',
      },
      didOpen: () => {
        // Az üzenetküldés gomb stílusainak felülírása
        const confirmButton = Swal.getConfirmButton();
        if (confirmButton) {
          confirmButton.style.backgroundColor = '#28a745';
          confirmButton.style.color = '#fff';
          confirmButton.style.marginRight = '5px';
        }
    
        // A Mégsem gomb stílusainak felülírása
        const cancelButton = Swal.getCancelButton();
        if (cancelButton) {
          cancelButton.style.backgroundColor = '#dc3545';
          cancelButton.style.color = '#fff';
          cancelButton.style.marginLeft = '5px';
        }
      }
    });
    
    if (isConfirmed && text) {
      this.sendMessageFromSearch(text);
    }
  }

  ngAfterViewInit() {
      AOS.init({
        once: true
      });
    this.openSweetAlertOnLoad();
  }
}
