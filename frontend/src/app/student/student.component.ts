import { ApplicationRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private route:ActivatedRoute, private router:Router, public studentsService:StudentsService) { }

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
