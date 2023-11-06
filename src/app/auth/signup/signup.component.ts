import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as AOS from 'aos';
import { Player } from 'src/app/model/Player';
import { Role } from 'src/app/model/Roles';
import { Scout } from 'src/app/model/Scout';
import { ScoutService } from 'src/app/services/scout.service';
import { passwordMatchValidator } from 'src/app/validators/password-match-validator';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  registerFormPlayer!: FormGroup
  registerFormScout!: FormGroup
  showForm: string = 'none';
  passwordsMatch: boolean = true;

  constructor(private scoutService: ScoutService, private fb: FormBuilder) {
    this.registerFormPlayer = this.fb.group({
      lastname: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      position: ['', [Validators.required]],
      sport: ['', [Validators.required]],
      location: ['', [Validators.required]],
      age: [0, [Validators.required]],
      password: ['', [Validators.required]],
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
      password: ['', [Validators.required]],
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
      this.scoutService.registerScout(scoutData).subscribe(res => {
        console.log('Sikeres mentés', res);
      }, error => {
        console.error('Mentés sikertelen', error);
      });
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
      this.scoutService.registerPlayer(playerData).subscribe(res => {
        console.log('Sikeres mentés', res);
      }, error => {
        console.error('Mentés sikertelen', error);
      });
    }
    console.log(this.registerFormPlayer.get('password')?.value)
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    AOS.init({
      once: true
    });
  }

}
