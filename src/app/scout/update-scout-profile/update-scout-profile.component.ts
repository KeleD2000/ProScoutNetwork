import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { UpdateScout } from 'src/app/model/UpdateScout';
import { FileService } from 'src/app/services/file.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-scout-profile',
  templateUrl: './update-scout-profile.component.html',
  styleUrls: ['./update-scout-profile.component.css']
})
export class UpdateScoutProfileComponent {
  updateForm!: FormGroup;
  profObjHtml: any[] = [];

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router, private fileService: FileService){
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
