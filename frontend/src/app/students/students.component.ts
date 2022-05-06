import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../login.service';
import { Student } from '../models/student';
import { StudentsService } from '../students.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  displayedColumns: string[] = ['_id', 'name', 'email', 'major', 'role', 'studentId', 'dateOfBirth', 'dateOfInscription', 'ops'];

  students:any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(private router:Router, public studentsService:StudentsService, public loginService:LoginService) { }

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents(){
    this.studentsService.getStudents().subscribe(
      (students:any)=>{
        console.log(students.students);
        this.students = new MatTableDataSource<Student>(students.students);
        this.students.paginator = this.paginator;
      },
      (error: any)=>{
        console.log("Error")
      }
    )
  }

  deleteStudent(id:String){
    this.studentsService.deleteStudent(id).subscribe(
      (students:any)=>{
        console.log(students.msg);
        this.getStudents();
      },
      (error: any)=>{
        console.log("Error")
      }
    );
  }
}
