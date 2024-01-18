import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { UpdateScout } from 'src/app/model/UpdateScout';
import { NotificationsBidDto } from 'src/app/model/dto/NotificationsBidDto';
import { BidService } from 'src/app/services/bid.service';
import { FileService } from 'src/app/services/file.service';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-scout-profile',
  templateUrl: './update-scout-profile.component.html',
  styleUrls: ['./update-scout-profile.component.css']
})
export class UpdateScoutProfileComponent {
  updateForm!: FormGroup;
  profObjHtml: any[] = [];

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router, 
    private fileService: FileService, private websocketService: WebsocketService, private bidService: BidService){
    this.updateForm = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname : ['', [Validators.required]],
      sport : ['', [Validators.required]],
      team : ['', [Validators.required]],
      email : ['', [Validators.required, Validators.email]],
    });
  }

  onUpdateProfile() {
    const user = localStorage.getItem('isLoggedin');
    let username: string | undefined;
  
    if (user) {
      username = user.replace(/"/g, '');
    }
  
    if (this.updateForm.valid && username) {
      const updateData: UpdateScout = {
        username: username,
        last_name: this.updateForm.get('lastname')?.value,
        first_name: this.updateForm.get('firstname')?.value,
        team: this.updateForm.get('team')?.value,
        sport: this.updateForm.get('sport')?.value,
        email: this.updateForm.get('email')?.value,
      };
  
      this.userService.updateScout(updateData).subscribe( update => {
        console.log("Sikeres fríssités", update);
        this.router.navigateByUrl('/scout-profile')
      }, error => {
        console.error('fríssités sikertelen', error);
      });

    }
  }
  
  ngOnInit(){
    this.websocketService.initializeWebSocketConnection();

    this.websocketService.getNotifications().subscribe((not: NotificationsBidDto) => {
      console.log(not);
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success m-1',
          cancelButton: 'btn btn-danger m-1',
        },
        buttonsStyling: false,
      });
      
      swalWithBootstrapButtons
        .fire({
          title: 'Licitálás értesítés',
          text: not.message,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Elfogadom!',
          cancelButtonText: 'Nem fogadom el!',
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            swalWithBootstrapButtons.fire({
              title: 'Elfogadtad a licitálást',
              text: 'Sikeresen elfogadtad a licitálást, átnavigálunk a licitáló felületre.',
              icon: 'success',
            });
            this.router.navigate(['/scout-bid']);
            localStorage.setItem('isBid', JSON.stringify(true));
            const usernamePlayer = localStorage.getItem('isLoggedin');
            var current = usernamePlayer?.replace(/"/g, '');
            if(current){
              this.bidService.connectUser(current).subscribe(
                (response: any) => {
                  console.log('Sikeres csatlakozás', response.message);
                },
                (error) => {
                  console.error('Hiba történt a csatlakozás során', error.error);
                }
              );
            }
          } else if (
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire({
              title: 'Nem fogadtad el a licitálást.',
              text: 'Nem éltél a licitálás lehetőségével.',
              icon: 'error',
            });
          }
        });
    });

    const username = localStorage.getItem('isLoggedin');
    const converted = username?.replace(/"/g, '');
    this.fileService.getCurrentUser(converted).subscribe( user => {
      for(const [key, value] of Object.entries(user)){

        if(key === 'scout'){
          console.log(value);
          var profObj = {
            last_name : '',
            first_name: '',
            email: '',
            team: '',
            sport: ''
          }

          profObj.last_name = value.last_name;
          profObj.first_name = value.first_name;
          profObj.email = value.email;
          profObj.team = value.team;
          profObj.sport = value.sport;
          this.profObjHtml.push(profObj);
        }
      }
    });
  }
  
  ngAfterViewInit() {
    AOS.init({
      once: true
    });
  }
}
