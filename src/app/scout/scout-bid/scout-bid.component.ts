import { ChangeDetectorRef, Component, NgZone, Renderer2 } from '@angular/core';
import { forkJoin, from } from 'rxjs';
import { filter, delay, map, switchMap } from 'rxjs/operators';
import { FileService } from 'src/app/services/file.service';
import * as AOS from 'aos';
import { MessagesService } from 'src/app/services/messages.service';
import { MessageDto } from 'src/app/model/dto/MessageDto';
import { WebsocketService } from 'src/app/services/websocket.service';
import { User } from 'src/app/model/User';
import { ActivatedRoute, Router } from '@angular/router';
import { BidService } from 'src/app/services/bid.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-scout-bid',
  templateUrl: './scout-bid.component.html',
  styleUrls: ['./scout-bid.component.css']
})
export class ScoutBidComponent {
  receiverId: number = 0;
  senderUsernameByWebSocket: string = '';
  senderIdByWebSocket: number = 0;
  receiverUsernameByWebSocket: string = '';
  senderProfPic: string = '';
  selectedPlatform: string = '';
  showModal: boolean = false;
  modalTitle: string = '';
  //isItMessages: boolean = false;
  image: any;
  message: string = '';
  searchMessage: string = '';
  rightNow: boolean = false;
  searchUsername: string = '';
  theSearcherIsScout: boolean = false;
  theSearcherIsPlayer: boolean = false;
  searchUserId: number = 0;
  senderUser?: User;
  combinedMessages: any[] = [];
  senderArray: any[] = [];
  senderObject: any = {};
  groupChatArray: any[] = [];
  connectReceiverId: number = 0;
  receiverMessageArray: any[] = [];
  receivedData: any;
  keyExistsPlayer: string = '';
  isBid: boolean = false;

  constructor(private messageService: MessagesService, private fileService: FileService,
    private websocketService: WebsocketService, private changeDetector: ChangeDetectorRef,
    private renderer: Renderer2, private route: ActivatedRoute, private router: Router,
    private ngZone: NgZone, private bidService: BidService
  ) { }

  ngOnInit() {
    const isBidValue = localStorage.getItem('isBid');

    this.isBid = isBidValue ? JSON.parse(isBidValue) : null;

    const username = localStorage.getItem('isLoggedin');
    let current = username?.replace(/"/g, '');

    this.fileService.getCurrentUser(current).subscribe((prof) => {
      for (const [key, value] of Object.entries(prof)) {
        if (key === 'id') {
          this.receiverId = value;
        }
      }
    });

    this.route.queryParams.subscribe(params => {
      this.searchUsername = params['senderUsername'];
      this.searchUserId = params['senderId'];
    });

    const keyExistsScout = this.checkLocalStorageForKey('isScout');
    const keyExistsPlayer = this.checkLocalStorageForKey('isPlayer');

    if (keyExistsScout) {
      this.theSearcherIsScout = true;
    } else if (keyExistsPlayer) {
      this.theSearcherIsPlayer = true;
    }

    console.log(this.senderUser);
    this.websocketService.initializeWebSocketConnection();
    if (current) {
      this.senderUsernameByWebSocket = current;
      this.bidService.connectUser(current).subscribe(
        (response: any) => {
          console.log('Sikeres csatlakozás', response.message);
        },
        (error) => {
          console.error('Hiba történt a csatlakozás során', error.error);
        }
      );
    }

    this.websocketService.getGroupMessage().subscribe((mess: MessageDto) => {
      console.log(mess);
      let sendMessageObject = {
        id: mess.id,
        date_time: mess.timestamp,
        content: mess.message_content,
        sender_username: mess.senderUsername,
        user_type: 'sent',
        image: ""
      };
      console.log(sendMessageObject);
      this.fileService.getProfilePicBlob(sendMessageObject.sender_username).subscribe(
        (response: any) => {
          if (response) {
            const reader = new FileReader();
            reader.onload = () => {
              sendMessageObject.image = reader.result as string;
              this.groupChatArray.push(sendMessageObject);
              console.log(this.groupChatArray);
            };
            reader.readAsDataURL(new Blob([response], { type: 'image/png' }));
          }
        },
        (error) => {
          console.error('Error fetching profile picture:', error);
        }
      );
      this.ngZone.run(() => {
        this.changeDetector.detectChanges();
      });
    });

    this.getSendersWithDelay();
    this.getGroupMessages();
  }

  checkLocalStorageForKey(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  getSendersWithDelay() {
    this.bidService.getConnectUser().subscribe(users => {
      const username = localStorage.getItem('isLoggedin');
      let current = username?.replace(/"/g, '');

      for (const user of users) {
        console.log(user);
        if (user.username !== current) {
          this.connectReceiverId = user.id;

          this.bidService.getGroupMessages(this.connectReceiverId, this.searchUserId)
            .subscribe((receiver) => {
              console.log(receiver);
              this.receivedData = receiver;
              for (let i in this.receivedData) {
                if (this.receivedData && this.receivedData[i].messages) {
                  for (let j in this.receivedData[i].messages) {
                    const existingSender = this.senderArray.find(sender => sender.user_id === this.receivedData[i].messages[j].receiverId);
                    const messageObject: any = {
                      message_id: this.receivedData[i].messages[j].messageId,
                      message_content: this.receivedData[i].messages[j].content,
                      timestamp: this.receivedData[i].messages[j].timestamp,
                      sender_id: this.receivedData[i].messages[j].senderId,
                      sender_username: this.receivedData[i].messages[j].senderUsername
                    };

                    if (!existingSender) {
                      const senderObject: any = {
                        name: this.receivedData[i].receiverUsername,
                        user_id: this.receivedData[i].messages[j].receiverId,
                        image: "",
                        messages: [messageObject]
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
                    } else {
                      existingSender.messages.push(messageObject);
                    }
                  }

                }
              }
            });
        }
      }
    });
  }

  async getGroupMessages() {
    try {
      const users = await this.bidService.getConnectUser().toPromise();
      const username = localStorage.getItem('isLoggedin');
      const current = username?.replace(/"/g, '');
  
      for (const user of users) {
        if (user.username !== current) {
          this.connectReceiverId = user.id;
        }
      }
  
      const mess = await this.bidService.getGroupMessages(this.connectReceiverId, this.searchUserId).toPromise();
      console.log(mess);
  
      const messagePromises = mess.map(async (message: any) => {
        const transformedMessages: any[] = [];
  
        for (const [key, value] of Object.entries<any>(message)) {
          console.log(key, value);
          if (key === 'messages' && Array.isArray(value)) {
            console.log(value);
            for (const i in value) {
              console.log(value[i]);
              const sender_username = value[i].senderUsername;
  
              if (value[i].content && value[i].timestamp && value[i].senderId) {
                const image = await this.loadImage(sender_username);
  
                const uniqueId = `${value[i].content}_${sender_username}_${value[i].timestamp}`;
  
                const newMessage = {
                  uniqueId: uniqueId,
                  message_id: value[i].messageId,
                  timestamp: new Date(value[i].timestamp),
                  content: value[i].content,
                  sender_username: sender_username,
                  receiver_username: this.senderUsernameByWebSocket,
                  user_type: value[i].senderId === this.receiverId ? 'received' : 'sent',
                  image: image
                };
  
                transformedMessages.push(newMessage);
              }
            }
          }
        }
  
        return transformedMessages;
      });
  
      console.log(messagePromises);
      const combinedMessages = await Promise.all(messagePromises.map(async (promise: any) => await promise));
      console.log(combinedMessages);
      const uniqueMessages = Array.from(new Set(combinedMessages.flat().map((msg: any) => msg.uniqueId)))
        .map(uniqueId => combinedMessages.flat().find((msg: any) => msg.uniqueId === uniqueId));
  
      const sortedMessages = uniqueMessages
        .filter(message => message !== null)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
      this.groupChatArray.push(...sortedMessages);
      console.log(this.groupChatArray);
  
      return sortedMessages;
    } catch (error) {
      console.error(error);
      return [];
    }
  }


  private async loadImage(username: string): Promise<string | null> {
    try {
      const response: any = await this.fileService.getProfilePicBlob(username).toPromise();

      if (response) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(new Blob([response], { type: 'image/png' }));
        });
      } else {
        return Promise.resolve(null);
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      return Promise.resolve(null);
    }
  }

  sendMessage() {
  // Az időt most adjuk hozzá, itt azonosítási céllal
  const currentDateTime = new Date();
  const messageToSend: MessageDto = {
    message_content: this.message,
    timestamp: currentDateTime,
    senderUsername: this.senderUsernameByWebSocket,
    receiverUsername: this.searchUsername,
    senderUserId: this.receiverId,
    receiverUserId: this.searchUserId,
    anotherReceiverUserId: this.connectReceiverId,
    groupChat: 1
  };
  console.log(messageToSend);
  this.searchMessage = '';
  this.websocketService.sendGroupMessage(messageToSend);
  this.addMessageToChatFromSearch(messageToSend);
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


    this.groupChatArray.push(chatMessage);
    this.groupChatArray.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  sendMessageFromSearch(text: string) {
    // Az időt most adjuk hozzá, itt azonosítási céllal
    const currentDateTime = new Date();
    const messageToSend: MessageDto = {
      message_content: text,
      timestamp: currentDateTime,
      senderUsername: this.senderUsernameByWebSocket,
      receiverUsername: this.searchUsername,
      senderUserId: this.receiverId,
      receiverUserId: this.searchUserId,
      anotherReceiverUserId: this.connectReceiverId,
      groupChat: 1
    };
    console.log(messageToSend);
    this.searchMessage = '';
    this.websocketService.sendGroupMessage(messageToSend);
    this.addMessageToChatFromSearch(messageToSend);

  }

  addMessageToChatFromSearch(message: MessageDto) {
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

    this.groupChatArray.push(chatMessage);
    this.groupChatArray.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  calculateElapsedTime(timestamp: Date): string {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = now.getTime() - then.getTime();

    const minutes = Math.floor(diff / 60000); // milliszekundumok percben
    for (let i in this.senderArray) {
      if (minutes < 5) {
        this.senderArray[i].isRightNow = true;
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
      const name = params['senderUsername'];
      const id = params['senderId'];

      if (name && id) {
        this.showSweetAlert();
      }
    });
  }

  async showSweetAlert() {
    const { value: text, isConfirmed } = await Swal.fire({
      input: "textarea",
      inputLabel: `Üzenet küldés ${this.searchUsername} felhasználónak a licitáláshoz`,
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

  acceptPlayer(){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success m-1',
        cancelButton: 'btn btn-danger m-1',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
    .fire({
      title: 'Játékos felé érdeklődés',
      text: 'Biztosan érdekli ez a játékos? Ha igen, akkor kattintson az Igen gombra, és vegye fel vele a kapcsolatot privátba. Ha mégse, akkor Nem érdekel-re kattintva visszanavigáljuk a hirdetésre.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Érdekel!',
      cancelButtonText: 'Nem érdekel!',
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
          title: 'Elfogadtad az érdeklődést',
          text: 'Sikeresen elfogadtad a érdeklődést, átnavigálunk a hirdetés felületre, ahol megtalálod a játékost.',
          icon: 'success',
        });
        this.router.navigate(['/scout-main']);
        localStorage.setItem('isBid', JSON.stringify(false));
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: 'Nem fogadtad el a érdeklődést.',
          text: 'Nem éltél a érdeklődést lehetőségével, átnavigálunk a hirdetés felületre, ahol tovább keresgélhetsz.',
          icon: 'error',
        });
        this.router.navigate(['/scout-main']);
        localStorage.setItem('isBid', JSON.stringify(false));
      }
    });
  }

  acceptBid(){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success m-1',
        cancelButton: 'btn btn-danger m-1',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
    .fire({
      title: 'Ajánlat felé érdeklődés',
      text: 'Biztosan érdekli az egyik ajánlat? Ha igen, akkor kattintson az Igen gombra, és vegye fel vele a kapcsolatot privátba. Ha mégse, akkor Nem érdekel-re kattintva visszanavigáljuk a hirdetésre.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Érdekel!',
      cancelButtonText: 'Nem érdekel!',
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
          title: 'Elfogadtad az érdeklődést',
          text: 'Sikeresen elfogadtad a érdeklődést, átnavigálunk a hirdetés felületre, ahol megtalálod a játékoskeresőt.',
          icon: 'success',
        });
        this.router.navigate(['/player-main']);
        localStorage.setItem('isBid', JSON.stringify(false));
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: 'Nem fogadtad el a érdeklődést.',
          text: 'Nem éltél a érdeklődést lehetőségével, átnavigálunk a hirdetés felületre, ahol tovább keresgélhetsz.',
          icon: 'error',
        });
        this.router.navigate(['/player-main']);
        localStorage.setItem('isBid', JSON.stringify(false));
      }
    });
  }

  async ngAfterViewInit() {
    AOS.init({
      once: true
    });
    this.openSweetAlertOnLoad();
  }
}
