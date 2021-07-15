import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import { EncodeUserService } from 'src/app/encode/services/EncodeUserService';
import { EncodeUsersDataSource } from './encodeUsersDataSource';
import { InviteFormComponent } from './invite-form-component/invite-form.component';

@Component({
  selector: 'app-admin-encode',
  templateUrl: './admin-encode.component.html',
  styleUrls: ['../admin.component.scss'],
})
export class AdminEncodeComponent implements OnInit{

  public usersDataSource: EncodeUsersDataSource;
  public totalTestsCounter: any = { count: -1 };
  public pageSize: number = 10;

  // Columnas de la tabla que se van a mostrar
  displayedColumns: string[] = ["name", "email", "creationDate" ];

  constructor(
    private _encodeUserService: EncodeUserService,
    private _dialog: MatDialog,
    private _dbService: DataDbService) {}
  
  ngOnInit(): void 
  {
    this.usersDataSource = new EncodeUsersDataSource(this._dbService);
    // this.usersDataSource.loadTests(this.pageSize);

    // Get total number of users
    this._dbService.getCreativesMetadataCounter().snapshotChanges().subscribe( counterData => {
      this.totalTestsCounter = counterData.payload.data();
    });
  }
  
  public openInviteDialog(): void {
    const dialogRef = this._dialog.open(InviteFormComponent);

    dialogRef.afterClosed().subscribe(this._dialogClosedObserver);
  }

  private _dialogClosedObserver = async (userData: { name: string, email: string }) => {
    if (userData)
    {
      await this._encodeUserService.createNewUser(userData);
    }
  }

}
