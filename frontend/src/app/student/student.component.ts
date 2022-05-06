import { ApplicationRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../login.service';
import { Student } from '../models/student';
import { StudentsService } from '../students.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  id:String;
  student:Student;
  error="";

  constructor(private route:ActivatedRoute, private router:Router, public studentsService:StudentsService, public loginService:LoginService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getStudent(this.id)
  }

  saveStudent(){
    this.studentsService.saveStudent(this.student, this.id).subscribe(
      (student:any)=>{
        console.log("good");
        this.router.navigate(["/students"]);
      },
      (error: any)=>{
        this.error = "All inputs are required, please verify your entries."
      }
    );
}

getStudent(studentId:String){
  this.studentsService.getStudent(studentId).subscribe(
    (student:any)=>{
      this.student=student.studentInfo;
    },
    (error: any)=>{
      console.log("Error")
    }
  )
}
}
