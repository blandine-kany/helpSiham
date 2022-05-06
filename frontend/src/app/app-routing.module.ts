import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { StudentAddComponent } from './student-add/student-add.component';
import { StudentComponent } from './student/student.component';
import { StudentsComponent } from './students/students.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserComponent } from './user/user.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'users', component: UsersComponent },
  { path: 'login', component: LoginComponent },
  { path: 'users/:id', component: UserComponent },
  { path: 'register', component: UserRegisterComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'students/:id', component: StudentComponent },
  { path: 'studentadd', component: StudentAddComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
