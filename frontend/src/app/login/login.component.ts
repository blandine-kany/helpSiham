import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  password = "";
  hide = true;
  error = "";

  constructor(private route:ActivatedRoute, private router:Router, public loginService:LoginService) { }

  ngOnInit(): void {
  }

  login(){
    var indata = {'email': this.email.value, 'password': this.password };
    this.loginService.login(indata).subscribe(
      (data:any)=>{
        this.loginService.isLogged();
        this.router.navigate(["/home"]);
        this.error = data.msg;
      },
      (error: any)=>{
        this.error = "Email or password incorrect."
      }
    );
  }

  // For Email Validation and password*******
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
  // End **********

}
