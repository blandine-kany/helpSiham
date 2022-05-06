import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private route:ActivatedRoute, private router:Router, public usersService:UsersService) { }

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
          console.log("Error")
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
