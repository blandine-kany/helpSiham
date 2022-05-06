import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsers():any{
    return this.http.get("http://localhost:3000/api/v1/users",  {withCredentials : true});
  }

  getUser(userId:String):any{
    return this.http.get("http://localhost:3000/api/v1/users/"+userId,  {withCredentials : true});
  }

  saveUser(user:User, userId:String):any{
    return this.http.patch("http://localhost:3000/api/v1/users/"+userId, user,  {withCredentials : true});
  }

  addUser(user:User):any{
    return this.http.post("http://localhost:3000/api/v1/auth/register", user);
  }

  deleteUser(id:String):any{
    return this.http.delete("http://localhost:3000/api/v1/users/"+id,  {withCredentials : true});
  }
}
