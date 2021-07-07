import { Component } from '@angular/core';
import { IEncodeUser } from 'src/app/encode/models/IEncodeUser';
import { EncodeUserService } from 'src/app/encode/services/EncodeUserService';

@Component({
  selector: 'app-admin-encode',
  templateUrl: './admin-encode.component.html',
  styleUrls: ['../admin.component.scss'],
})
export class AdminEncodeComponent{

  public users: Array<IEncodeUser>;

  constructor(private _encodeUserService: EncodeUserService) {}
  
  public async generateUserId(){
    const id: string = (await this._encodeUserService.createUser()).uid;
    // armar el link...
  }

}
