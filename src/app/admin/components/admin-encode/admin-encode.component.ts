import { Component } from '@angular/core';
import { EncodeUserService } from 'src/app/encode/services/EncodeUserService';

@Component({
  selector: 'app-admin-encode',
  templateUrl: './admin-encode.component.html',
  styleUrls: ['../admin.component.scss'],
})
export class AdminEncodeComponent{

  constructor(private _encodeUserService: EncodeUserService) {}
  
  public async generateUserId(){
    const id: string = (await this._encodeUserService.createUser()).userId;
    // armar el link...
  }

}
