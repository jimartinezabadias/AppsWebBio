import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';
// import { DataDbService } from 'src/app/core/services/db/data-db.service';
import { EncodeUserService } from 'src/app/encode/services/EncodeUserService';
import { EncodeUsersDataSource } from './encodeUsersDataSource';
import { InviteFormComponent } from './invite-form-component/invite-form.component';
import { Router } from '@angular/router';
import { Parser, transforms } from 'json2csv';
// import { PlatformLocation } from '@angular/common';
import { encodeCSVFields } from '../../constants';


const SEPARATOR = "_";

@Component({
  selector: 'app-admin-encode',
  templateUrl: './admin-encode.component.html',
  styleUrls: ['admin-encode.component.scss','../admin.component.scss'],
})
export class AdminEncodeComponent implements OnInit {

  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  private _pageIndex: number = 0;
  private _csvFields = encodeCSVFields;

  public usersDataSource: EncodeUsersDataSource;
  public totalTestsCounter: any = { count: -1 };
  public pageSize: number = 5;
  public isLoading: boolean = false

  // Columnas de la tabla que se van a mostrar
  public displayedColumns: string[] = ["name", "email", "link" ,"creationDate" ];
  
  constructor(
    private _encodeUserService: EncodeUserService,
    private _dialog: MatDialog,
    private _router: Router,
    // private _platformLocation: PlatformLocation
    ) {}
  
  ngOnInit(): void 
  {
    // this.usersDataSource = new EncodeUsersDataSource(this._dbService);
    // this.usersDataSource.loadUsers(this.pageSize);

    // // Get total number of users
    // this._dbService.getEncodeMetadataCounter().snapshotChanges().subscribe( this._userCounterObserver );
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
  
  // INVITE
  public openInviteDialog(): void {
    const dialogRef = this._dialog.open(InviteFormComponent);

    dialogRef.afterClosed().subscribe(this._inviteDialogClosed$);
  }

  private _inviteDialogClosed$ = async (userData: { name: string, email: string }) => {
    if (userData)
    {
      this.isLoading = true;
      await this._encodeUserService.createNewUser(userData);
      this.usersDataSource.loadUsers(this.pageSize);
      this.isLoading = false;
    }
  }

  public getUserResults(uid) {
    this._router.navigate(['/admin/encode/', uid]);
  }

  public async downloadCSV() {
    // let encodeUsers = await this._dbService.getAllEncodeUsersData();
    // let temp = JSON.parse(JSON.stringify(encodeUsers));
    // let downloadPrefix = (this._platformLocation as any).location.origin + "/admin/encode/";
    // for (let i = 0; i < temp.length; i++) {
    //   temp[i].link_audios = downloadPrefix + temp[i].uid + "/audios";
    //   temp[i].creationDate = new Date(temp[i].creationDate.seconds*1000);
    // }

    // let csvString = this.generateCSV(temp);
    // this.openDownloadWindow(csvString);
  }

  

  private _userCounterObserver = (counterData) => {
    this.totalTestsCounter = counterData.payload.data();
  }

  private openDownloadWindow(csvString: string) {
    // Download
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }

  private generateCSV(temp: string): string {
    const flatOptions = transforms.flatten({ objects: true, arrays: true, separator: SEPARATOR });
    const json2csvParser = new Parser({ fields: this._csvFields, transforms: [ flatOptions ] });
    
    return json2csvParser.parse(temp);
  }
}
