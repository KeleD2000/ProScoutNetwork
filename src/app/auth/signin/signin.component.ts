import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  isItPlayer: boolean = false;
  isItScout: boolean = false;

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
      this.authService.login(loginUser).subscribe( p => {
        for(const [key, value] of Object.entries(p)){
          for(let i in value){
            if(value[i].authority === 'PLAYER'){
              this.isItPlayer = true;
              localStorage.setItem('isPlayer', JSON.stringify(this.isItPlayer));
            }else if(value[i].authority === 'SCOUT'){
              this.isItScout = true;
              localStorage.setItem('isScout', JSON.stringify(this.isItScout));
            }
          }
        }
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
