import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  connectedUser:any = null;

  constructor(private http: HttpClient) {
    this.isLogged();
   }

  login(indata:any):any{
    return this.http.post("http://localhost:3000/api/v1/auth/login", indata, {withCredentials : true});
  }

  logout():any{
    return this.http.get("http://localhost:3000/api/v1/auth/logout", {withCredentials : true});
  }

  isLogged():any{
    return this.http.get("http://localhost:3000/api/v1/auth/islogged", {withCredentials : true}).subscribe(
      (data:any)=>{
        this.connectedUser = data.user;
      },
      (error: any)=>{
        console.log("Error")
      }
    );;
  }
}
