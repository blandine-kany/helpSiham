import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../login.service';
import { User } from '../models/user';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})



export class UserRegisterComponent implements OnInit {

  USER_TYPE = {name: {last:"", first:""},email:"",position:"", password:"", confirmPassword:""}
  user:any;
  error="";

  constructor(private route:ActivatedRoute, private router:Router, public usersService:UsersService, public loginService:LoginService) { }

  ngOnInit(): void {
    this.user = this.USER_TYPE;
  }

  saveUser(){
      this.usersService.addUser(this.user).subscribe(
        (user:any)=>{
          console.log("good");
          this.router.navigate(["/login"]);
        },
        (error: any)=>{
          this.error = "All inputs are required, please verify your entries.";
        }
      );
  }

  getUser(userId:String){
    this.usersService.getUser(userId).subscribe(
      (user:any)=>{
        this.user=user.userInfo;
      },
      (error: any)=>{
        console.log("Error")
      }
    )
  }

}
