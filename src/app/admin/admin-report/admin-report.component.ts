import { Component } from '@angular/core';
import * as AOS from 'aos';
import { ReportDto } from 'src/app/model/dto/ReportDto';
import { AdminService } from 'src/app/services/admin.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-report',
  templateUrl: './admin-report.component.html',
  styleUrls: ['./admin-report.component.css']
})
export class AdminReportComponent {
  timerInterval: any;
  reportArray: any[] = [];

  constructor(private adminService: AdminService, private websocketService: WebsocketService){}

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

    this.adminService.getAllReports().subscribe(reportsObject => {
      const reportsArray = Object.values(reportsObject);
      for (const report of reportsArray) {
        const reportObject = {
          report_id: report.report_id,
          report_content: report.report_content,
          report_username: report.report_username,
          timestamp: this.formatDate(report.timestamp)
        }
        this.reportArray.push(reportObject);
      }
    });
  }
  
  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    const seconds = this.padZero(date.getSeconds());
  
    return `${year}.${month}.${day}. ${hours}:${minutes}:${seconds}`;
  }
  
  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
  

  ngAfterViewInit(){
    AOS.init({
      once: true
    });
   }

}
