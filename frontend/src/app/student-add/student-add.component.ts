import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../login.service';
import { StudentsService } from '../students.service';

@Component({
  selector: 'app-student-add',
  templateUrl: './student-add.component.html',
  styleUrls: ['./student-add.component.scss']
})
export class StudentAddComponent implements OnInit {

  STUDENT_TYPE = {name: {last:"", first:""},email:"",major:"", studentId:"", role:"", dateOfBirth:"", dateOfInscription:""}
  student:any;
  error="";

  constructor(private route:ActivatedRoute, private router:Router, public studentsService:StudentsService, public loginService:LoginService) { }

  ngOnInit(): void {
    this.student = this.STUDENT_TYPE;
  }

  saveStudent(){
    this.studentsService.addStudent(this.student).subscribe(
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
