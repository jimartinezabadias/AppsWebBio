import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IEncodeUser } from 'src/app/encode/models/IEncodeUser';
import {  PerpetratorCondition, SomnolenceDegree } from 'src/app/encode/constants';

import { EncodeUserService } from 'src/app/encode/services/EncodeUserService';
import { EncodeFirestoreService } from 'src/app/core/encodeFirestore.service';

@Component({
  selector: 'app-admin-encode-user',
  templateUrl: './admin-encode-user.component.html',
  styleUrls: ['admin-encode-user.component.scss','../../admin.component.scss'],
})
export class AdminEncodeUserComponent implements OnInit {

  public user : IEncodeUser;
  
  // Columnas de la tabla que se van a mostrar
  public displayedColumns: string[] = ["email", "link", "creationDate" ];
  public somnolenceDegrees = SomnolenceDegree;
  public selectedPerpetratorCondition: PerpetratorCondition | null = null;

  constructor(
    private _encodeUserService: EncodeUserService,
    private _encodeFirestoreService: EncodeFirestoreService,
    private _route: ActivatedRoute,
    private _router: Router) {}

  get perpetratorConditions() 
  {
    return PerpetratorCondition;
  }

  ngOnInit() 
  {
    let userIdParam = this._route.snapshot.paramMap.get('userId');
    
    if (this._encodeUserService.user && this._encodeUserService.user.uid == userIdParam ) {
      this.user = this._encodeUserService.user;
    } 
    else {
      this._router.navigate(['/admin/encode/']);
    }
    
    if (this.user.sessionTwo != null){
      this.selectedPerpetratorCondition = this.user.sessionTwo.perpetratorCondition;
    }
  }

  public async applyPerpetratorCondition(): Promise<void> {
    this.user.sessionTwo.perpetratorCondition = this.selectedPerpetratorCondition;
    await this._encodeFirestoreService.updateEncodeUser(this.user);
  }

}