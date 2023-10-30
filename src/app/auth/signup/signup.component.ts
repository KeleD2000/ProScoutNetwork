import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as AOS from 'aos';
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
      sport: ['', [Validators.required]],
      team: ['', [Validators.required]],
      password: ['', [Validators.required]],
      passwordAccept: ['', [Validators.required]],
    });
  }

  onSubmitScout(){
    if(this.registerFormScout.valid){
      const scoutData = this.registerFormScout.value;
      this.scoutService.registerScout(scoutData).subscribe( res => {
        console.log('Sikeres mentés', res);
      }, error => {
        console.error('Mentés sikertelen', error);
      });
    }
  }
  
  ngOnInit(){
    AOS.init();

  }

}
