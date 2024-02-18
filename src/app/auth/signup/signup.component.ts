import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { Player } from 'src/app/model/Player';
import { Role } from 'src/app/model/Roles';
import { Scout } from 'src/app/model/Scout';
import { AuthService } from 'src/app/services/auth.service';
import { passwordMatchValidator } from 'src/app/validators/password-match-validator';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate(300)]),
      transition(':leave', animate(300, style({ opacity: 0 })))
    ])
  ]
})
export class SignupComponent {
  registerFormPlayer!: FormGroup
  registerFormScout!: FormGroup
  showForm: string = 'none';
  isError: boolean = false;
  errorMessage: string = '';
  passwordsMatch: boolean = true;

  constructor(private fb: FormBuilder, private router : Router, private authService: AuthService) {
    this.registerFormPlayer = this.fb.group({
      lastname: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      position: ['', [Validators.required]],
      sport: ['', [Validators.required]],
      location: ['', [Validators.required]],
      age: [0, [Validators.required]],
      password: ['', [Validators.required, Validators.min(8)]],
      passwordAccept: ['', [Validators.required]],
    }, {
      validators: passwordMatchValidator
    });

    this.registerFormScout = this.fb.group({
      lastname: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      sport: ['', [Validators.required]],
      team: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.min(8)]],
      passwordAccept: ['', [Validators.required]],
    }, {
      validators: passwordMatchValidator
    });
  }


  onSubmitScout() {
    if (this.registerFormScout.valid) {
      const scoutData: Scout = {
        last_name: this.registerFormScout.get('lastname')?.value,
        first_name: this.registerFormScout.get('firstname')?.value,
        email: this.registerFormScout.get('email')?.value,
        username: this.registerFormScout.get('username')?.value,
        sport: this.registerFormScout.get('sport')?.value,
        team: this.registerFormScout.get('team')?.value,
        password: this.registerFormScout.get('password')?.value,
        roles: Role.Scout

      }
      this.authService.registerScout(scoutData).subscribe(res => {
        console.log('Sikeres mentés', res);
        this.router.navigate(['/signin']);
      }, (error) => {
        console.log(error);
        if(error.status === 400){
          this.isError = true;
          this.errorMessage = error.error.message;
        }
      })
    }
  }

  onSubmitPlayer() {
    if (this.registerFormPlayer.valid) {
      const playerData: Player = {
        last_name: this.registerFormPlayer.get('lastname')?.value,
        first_name: this.registerFormPlayer.get('firstname')?.value,
        email: this.registerFormPlayer.get('email')?.value,
        username: this.registerFormPlayer.get('username')?.value,
        sport: this.registerFormPlayer.get('sport')?.value,
        position: this.registerFormPlayer.get('position')?.value,
        location: this.registerFormPlayer.get('location')?.value,
        age: this.registerFormPlayer.get('age')?.value,
        password: this.registerFormPlayer.get('password')?.value,
        roles: Role.Player
      }
      this.authService.registerPlayer(playerData).subscribe(res => {
        console.log('Sikeres mentés', res);
        this.router.navigate(['/signin']);
      }, (error) => {
        console.log(error);
        if(error.status === 400){
          this.isError = true;
          this.errorMessage = error.error.message;
        }
      })
    }
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    AOS.init({
      once: true
    });
  }

}
