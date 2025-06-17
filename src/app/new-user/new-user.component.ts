import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent {

 constructor( private userService: UserService,
	      private router: Router
    ) 
 {
 } 

 myPayloadUser = new User();
 myNewUser = new User();

 createUser() {
  console.log(this.myPayloadUser);

  this.userService.createUser(this.myPayloadUser).subscribe({
    next: (res: any) => {
      console.log('Usuario creado:', res);


      this.myNewUser = res;

      if (this.myNewUser && this.myNewUser.id != 0) {
        this.router.navigate(['/login']);
      }
    },
    error: (err) => {
      console.error('Error al crear usuario:', err);
    }
  });
}

}