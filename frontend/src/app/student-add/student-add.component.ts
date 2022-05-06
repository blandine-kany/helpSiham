import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsService } from '../students.service';

@Component({
  selector: 'app-student-add',
  templateUrl: './student-add.component.html',
  styleUrls: ['./student-add.component.scss']
})
export class StudentAddComponent implements OnInit {

  STUDENT_TYPE = {name: {last:"", first:""},email:"",major:"", studentId:"", role:"", dateOfBirth:"", dateOfInscription:""}
  student:any;

  constructor(private route:ActivatedRoute, private router:Router, public studentsService:StudentsService) { }

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
        console.log("Error")
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
