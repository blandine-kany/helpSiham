import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})



export class UserComponent implements OnInit {

 id:String;
  user:User;

  constructor(private route:ActivatedRoute, private router:Router, public usersService:UsersService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getUser(this.id)

  }

  saveUser(){
      this.usersService.saveUser(this.user, this.id).subscribe(
        (user:any)=>{
          console.log("good");
          this.router.navigate(["/users"]);
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
