import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Credential } from '../models/user/Credential';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private router: Router
  ) {}

  callLogin() {
    const myCredential = new Credential();
    myCredential.username = this.username;
    myCredential.password = this.password;

    this.userService.postLogin(myCredential).subscribe({
      next: (data: any) => {
        console.log('user logged:', data);

        this.storageService.setSession('user', myCredential.username);
        this.storageService.setSession('token', data.accessToken);


        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Login failed', err);
        alert('Login incorrecto o fallo de conexión');
        this.username = '';
        this.password = '';
      }
    });
  }
}
