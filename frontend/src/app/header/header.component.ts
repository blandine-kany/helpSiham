import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private route:ActivatedRoute, private router:Router, public loginService:LoginService) { }

  ngOnInit(): void {
  }

  logout(){
    this.loginService.logout().subscribe(
      (data:any)=>{
        console.log(data.data)
        this.loginService.connectedUser = null;
      },
      (error: any)=>{
        console.log("error")
      }
    );
    this.router.navigate(["/login"]);
  }

}
