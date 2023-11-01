import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as AOS from 'aos';
import { Scout } from 'src/app/model/Scout';
import { ScoutService } from 'src/app/services/scout.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  registerFormPlayer!: FormGroup
  registerFormScout!:FormGroup
  showForm: string = 'none';

  constructor(private scoutService: ScoutService, private fb: FormBuilder){
    this.registerFormPlayer = this.fb.group({
      lastname: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      sport: ['', [Validators.required]],
      location: ['', [Validators.required]],
      age: ['', [Validators.required]],
      password: ['', [Validators.required]],
      passwordAccept: ['', [Validators.required]],
    });

    this.registerFormScout = this.fb.group({
      lastname:['', [Validators.required]],
      firstname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      team: ['', [Validators.required]],
      password: ['', [Validators.required]],
      passwordAccept: ['', ],
    });
  }

  onSubmitScout(){
    console.log("szar");
    console.log(this.registerFormScout.valid);
    if(this.registerFormScout.valid){
      const scoutData: Scout = {
        lastname : this.registerFormScout.get('lastname')?.value,
        firstname: this.registerFormScout.get('firstname')?.value,
        email: this.registerFormScout.get('email')?.value,
        username: this.registerFormScout.get('username')?.value,
        sport: this.registerFormScout.get('sport')?.value,
        team: this.registerFormScout.get('team')?.value,
        password: this.registerFormScout.get('password')?.value

      }
      this.scoutService.registerScout(scoutData).subscribe( res => {
        console.log('Sikeres mentés', res);
      }, error => {
        console.error('Mentés sikertelen', error);
      });
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
