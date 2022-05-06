import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { User } from '../models/user';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  displayedColumns: string[] = ['_id', 'name', 'email', 'position', 'role', 'created_at', 'ops'];

  users: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public usersService: UsersService, private router:Router, public loginService:LoginService){}

  ngOnInit() {
    this.getUsers();
  }

  getUsers(){
    this.usersService.getUsers().subscribe(
      (users:any)=>{
        console.log(users.users)
        this.users = new MatTableDataSource<User>(users.users);
        this.users.paginator = this.paginator;
      },
      (error: any)=>{
        console.log("Error")
      }
    )
  }

  deleteUser(id:String){
    this.usersService.deleteUser(id).subscribe(
      (users:any)=>{
        console.log(users.msg);
        this.getUsers();
      },
      (error: any)=>{
        console.log("Error")
      }
    );
  }
}
