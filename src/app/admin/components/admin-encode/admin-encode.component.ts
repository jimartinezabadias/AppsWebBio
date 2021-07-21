import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';
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

  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  private _pageIndex: number = 0;

  public usersDataSource: EncodeUsersDataSource;
  public totalTestsCounter: any = { count: -1 };
  public pageSize: number = 5;

  // Columnas de la tabla que se van a mostrar
  public displayedColumns: string[] = ["name", "email", "link" ,"creationDate" ];

  constructor(
    private _encodeUserService: EncodeUserService,
    private _dialog: MatDialog,
    private _dbService: DataDbService) {}
  
  ngOnInit(): void 
  {
    this.usersDataSource = new EncodeUsersDataSource(this._dbService);
    this.usersDataSource.loadUsers(this.pageSize);

    // Get total number of users
    this._dbService.getEncodeMetadataCounter().snapshotChanges().subscribe( this._userCounterObserver );
  }

  ngAfterViewInit() {
    this._paginator.page
        .pipe(
            tap(() => {
              this._paginator._nextButtonsDisabled()
              this._paginator._previousButtonsDisabled()
              this._loadTestsPage()
            })
        )
        .subscribe();
  }

  private _loadTestsPage() {
    if (this._pageIndex < this._paginator.pageIndex){
      this.usersDataSource.loadNextPage(this.pageSize);
      this._pageIndex = this._paginator.pageIndex;
      return
    }
    this.usersDataSource.loadPrevPage(this.pageSize);
    this._pageIndex = this._paginator.pageIndex;
  }
  
  public openInviteDialog(): void {
    const dialogRef = this._dialog.open(InviteFormComponent);

    dialogRef.afterClosed().subscribe(this._dialogClosedObserver);
  }

  private _dialogClosedObserver = async (userData: { name: string, email: string }) => {
    if (userData)
    {
      await this._encodeUserService.createNewUser(userData);
      this.usersDataSource.loadUsers(this.pageSize);
    }
  }

  private _userCounterObserver = (counterData) => {
    this.totalTestsCounter = counterData.payload.data();
  }

}
