import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from './models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private http: HttpClient) { }

  getStudents():any{
    return this.http.get("http://localhost:3000/api/v1/students",  {withCredentials : true});
  }

  getStudent(studentId:String):any{
    return this.http.get("http://localhost:3000/api/v1/students/"+studentId,  {withCredentials : true});
  }

  saveStudent(student:Student, studentId:String):any{
    return this.http.put("http://localhost:3000/api/v1/students/"+studentId, student,  {withCredentials : true});
  }

  addStudent(student:Student):any{
    return this.http.post("http://localhost:3000/api/v1/students", student,  {withCredentials : true});
  }

  deleteStudent(id:String):any{
    return this.http.delete("http://localhost:3000/api/v1/students/"+id,  {withCredentials : true});
  }
}
