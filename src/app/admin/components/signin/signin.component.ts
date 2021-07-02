import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth-service/auth.service';

@Component({
  selector: 'app-adm-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['../admin.component.scss'],
})
export class SigninComponent{

  constructor(public auth: AuthService) {}
  
}
