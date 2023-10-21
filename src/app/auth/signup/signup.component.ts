import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as AOS from 'aos';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  registerForm!: FormGroup
  showForm: string = 'none';

  constructor(){
    this.registerForm = new FormGroup ({
      

    })
  }

  
  ngOnInit(){
    AOS.init();
  }

}
