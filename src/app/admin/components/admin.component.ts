import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/admin/auth.service';
import { VERSION_NUMBER } from '../constants';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {

  public versionNumber = VERSION_NUMBER;
  
  constructor(
    private _router: Router,
    public auth: AuthService
  ) 
  {
  }  

}
