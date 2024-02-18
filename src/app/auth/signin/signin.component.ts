import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { LoginResponse } from 'src/app/model/LoginResponse';
import { LoginUser } from 'src/app/model/LoginUser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  loginForm!: FormGroup
  isItPlayer: boolean = false;
  isItScout: boolean = false;
  isItAdmin: boolean = false;
  isError: boolean = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router){
    this.loginForm = this.fb.group({
      username : ['', [Validators.required]],
      password : ['', [Validators.required]]
    })
  }

  onSubmit(){
    if(this.loginForm.valid){
      const loginUser : LoginUser = {
        username: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value
      };
      this.authService.login(loginUser).subscribe( (p : LoginResponse) => {
        localStorage.setItem('isLoggedin', JSON.stringify(p.username));
        localStorage.setItem('isBid', JSON.stringify(false));
        for(const [key, value] of Object.entries(p)){
          for(let i in value){
            console.log(value[i]);
            if(value[i].authority === 'PLAYER'){
              this.isItPlayer = true;
              localStorage.setItem('isPlayer', JSON.stringify(this.isItPlayer));
              this.router.navigate(['player-main']);
            }else if(value[i].authority === 'SCOUT'){
              this.isItScout = true;
              localStorage.setItem('isScout', JSON.stringify(this.isItScout));
              this.router.navigate(['scout-main']);
            }else if(value[i].authority === 'ADMIN'){
              this.isItAdmin = true;
              localStorage.setItem('isAdmin', JSON.stringify(this.isItAdmin));
              this.router.navigate(['admin-main']);
            }
          }
        }
        
      }, (error) => {
        if(error.status === 400){
          this.isError = true;
          this.errorMessage = error.error.message;
        }
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
