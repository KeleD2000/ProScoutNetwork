import { Component } from '@angular/core';
import { delay } from 'rxjs/operators';
import { FileService } from 'src/app/services/file.service';
import * as AOS from 'aos';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-player-messages',
  templateUrl: './player-messages.component.html',
  styleUrls: ['./player-messages.component.css']
})
export class PlayerMessagesComponent {
  receiverId: number = 0;
  senderProfPic: string = '';
  isItMessages: boolean = false;
  image: any;
  senderArray: any[] = [];
  senderObject: any = {};
  sendMessageArray: any[] = [];
  receiverMessageArray: any[] = [];

  constructor(private messageService: MessagesService,  private fileService: FileService){}

  ngOnInit(){
    const username = localStorage.getItem('isLoggedin');
    let current = username?.replace(/"/g, '');
  
    this.fileService.getCurrentUser(current).subscribe((prof) => {
      for(const [key, value] of Object.entries(prof)){
        if(key === 'id'){
          this.receiverId = value;
          this.getSendersWithDelay();
        }
      }
    });
  }


  
  getSendersWithDelay() {
    this.messageService.getSenders(this.receiverId)
      .pipe(
        delay(1000)
      )
      .subscribe((receiver) => {
        for (let i in receiver) {
          const senderObject: any = {
            id: receiver[i].id,
            name: receiver[i].username,
            content: receiver[i].message_content,
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

  getMessages(senderId: number){
    this.sendMessageArray = [];
    this.receiverMessageArray = [];

    this.messageService.getMessages(senderId, this.receiverId).subscribe((mess) => {
      mess.forEach((message: { senderUser: { id: number; username: any; }; dateTime: any; message_content: any; }) => {
        console.log(message);
        if(this.receiverId !== message.senderUser.id){
          let sendMessageObject = {
            date_time: message.dateTime,
            content: message.message_content,
            sender_username: message.senderUser.username,
            image:""
          };
          this.fileService.getProfilePicBlob(sendMessageObject.sender_username).subscribe(
            (response: any) => {
              if (response) {
                const reader = new FileReader();
                reader.onload = () => {
                  sendMessageObject.image = reader.result as string; 
                  this.sendMessageArray.push(sendMessageObject);
                  console.log(this.sendMessageArray);
                };
                reader.readAsDataURL(new Blob([response], { type: 'image/png' }));
              }
            },
            (error) => {
              console.error('Error fetching profile picture:', error);
            }
          );
        }
        if(this.receiverId === message.senderUser.id){
          let receiverMessageObject = {
            date_time: message.dateTime,
            content: message.message_content,
            receiver_username: message.senderUser.username,
            image:""
          };
          this.fileService.getProfilePicBlob(receiverMessageObject.receiver_username).subscribe(
            (response: any) => {
              if (response) {
                const reader = new FileReader();
                reader.onload = () => {
                  receiverMessageObject.image = reader.result as string; 
                  this.receiverMessageArray.push(receiverMessageObject);
                };
                reader.readAsDataURL(new Blob([response], { type: 'image/png' }));
              }
            },
            (error) => {
              console.error('Error fetching profile picture:', error);
            }
          );
        }
      });
    })
    this.isItMessages = true;
  }
  
  

  ngAfterViewInit() {
    AOS.init({
      once: true
    });
  }
}
