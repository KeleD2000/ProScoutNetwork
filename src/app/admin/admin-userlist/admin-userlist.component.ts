import { Component } from '@angular/core';
import * as AOS from 'aos';
import { ReportDto } from 'src/app/model/dto/ReportDto';
import { UserService } from 'src/app/services/user.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { WebsocketService } from 'src/app/services/websocket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-userlist',
  templateUrl: './admin-userlist.component.html',
  styleUrls: ['./admin-userlist.component.css']
})
export class AdminUserlistComponent {
  timerInterval: any;
  faDelete = faTrash;
  userArray: any[] = [];

  constructor(private userService: UserService, private websocketService: WebsocketService) { }

  ngOnInit() {
    this.websocketService.initializeWebSocketConnection();

    this.websocketService.getReports().subscribe((report: ReportDto) => {
      console.log(report);
      Swal.fire({
        title: "Jelentés küldés",
        html: `<div><p>Kapott egy jelentést ${report.senderUsername} felhasználotól, a ${report.report_username} felhasználót jelentette, erre hivatkozva ${report.report_content}</p><p>Befogom zárni <b></b> múlva.</p></div>`,
        timer: 5000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const popup = Swal.getPopup();
          if (popup) {
            const timer = popup.querySelector("b") as HTMLElement;
            this.timerInterval = setInterval(() => {
              timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
          }
        },
        willClose: () => {
          clearInterval(this.timerInterval);
        }
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log("I was closed by the timer");
        }
      });
    });

    this.userService.getAllUsers().subscribe( user => {
      const userArray = Object.values(user);
      for (const user of userArray) {
        if(user.roles === 'PLAYER'){
          const userObject = {
            id: user.id,
            username: user.username
          }
          this.userArray.push(userObject);
        }

      }
    })
  }

  deletePlayer(username: string){
    this.userService.deletePlayer(username).subscribe(d => {
      window.location.reload();
    })
  }

  ngAfterViewInit() {
    AOS.init({
      once: true
    });
  }

}
