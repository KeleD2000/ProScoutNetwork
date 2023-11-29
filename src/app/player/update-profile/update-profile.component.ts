import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { UpdatePlayer } from 'src/app/model/UpdatePlayer';
import { FileService } from 'src/app/services/file.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent {
  updateForm!: FormGroup;
  profObjHtml: any[] = [];

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router, private fileService: FileService){
    this.updateForm = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname : ['', [Validators.required]],
      age : [0, [Validators.required]],
      sport : ['', [Validators.required]],
      location : ['', [Validators.required]],
      email : ['', [Validators.required, Validators.email]],
      position : ['', [Validators.required]],
    });
  }

  onUpdateProfile() {
    const user = localStorage.getItem('isLoggedin');
    let username: string | undefined;
  
    if (user) {
      username = user.replace(/"/g, '');
    }
  
    if (this.updateForm.valid && username) {
      const updateData: UpdatePlayer = {
        username: username,
        last_name: this.updateForm.get('lastname')?.value,
        first_name: this.updateForm.get('firstname')?.value,
        age: this.updateForm.get('age')?.value,
        sport: this.updateForm.get('sport')?.value,
        location: this.updateForm.get('location')?.value,
        email: this.updateForm.get('email')?.value,
        position: this.updateForm.get('position')?.value,
      };
  
      this.userService.updatePlayer(updateData).subscribe( update => {
        console.log("Sikeres fríssités", update);
        this.router.navigateByUrl('/player-profile')
      }, error => {
        console.error('fríssités sikertelen', error);
      });

    }
  }
  
  ngOnInit(){
    const username = localStorage.getItem('isLoggedin');
    const converted = username?.replace(/"/g, '');
    this.fileService.getCurrentUser(converted).subscribe( user => {
      for(const [key, value] of Object.entries(user)){
        if(key === 'player'){
          console.log(value);
          var profObj = {
            last_name : '',
            first_name: '',
            email: '',
            age: '',
            loca: '',
            pos: '',
            sport: ''
          }

          profObj.last_name = value.last_name;
          profObj.first_name = value.first_name;
          profObj.email = value.email;
          profObj.age = value.age;
          profObj.loca = value.location;
          profObj.pos = value.position;
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
