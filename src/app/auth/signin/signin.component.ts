import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { LoginUser } from 'src/app/model/LoginUser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  loginForm!: FormGroup

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router){
    this.loginForm = this.fb.group({
      username : [''],
      password : ['']
    })
  }

  onSubmit(){
    if(this.loginForm.valid){
      const loginUser : LoginUser = {
        username: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value
      };
      this.authService.login(loginUser).subscribe( p => {
        console.log("Sikeres bejelentkezés", p);
        this.router.navigate(['player-main']);
      })
    }else{
      console.log("Sikertelen bejelentkezés.");
    }
  }

  ngOnInit(){

  }

  ngAfterViewInit(){
    AOS.init({
      once: true
    });
   }

}
