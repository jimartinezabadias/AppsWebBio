import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';
import { EncodeUserService } from 'src/app/encode/services/EncodeUserService';
import { EncodeUsersDataSource } from './encodeUsersDataSource';
import { InviteFormComponent } from './invite-form-component/invite-form.component';
import { Router } from '@angular/router';
import { Parser, transforms } from 'json2csv';
import { CSV_SEPARATOR, encodeCSVFields, PAGE_SIZE } from '../../constants';
import { EncodeFirestoreService } from "src/app/core/encodeFirestore.service";
import { PlatformLocation } from '@angular/common';


@Component({
  selector: 'app-admin-encode',
  templateUrl: './admin-encode.component.html',
  styleUrls: ['admin-encode.component.scss','../admin.component.scss'],
})
export class AdminEncodeComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  private _pageIndex: number = 0;
  private _csvFields = encodeCSVFields;

  public encodeUserDataSource: EncodeUsersDataSource;
  public totalTestsCounter: { count: number } = { count: -1 };
  public isLoading: boolean = false;
  public pageSize = PAGE_SIZE;

  // Columnas de la tabla que se van a mostrar
  public displayedColumns: string[] = ["name", "email", "link" ,"creationDate" ];
  
  constructor(
    private _encodeUserService: EncodeUserService,
    private _encodeFirestoreService: EncodeFirestoreService,
    private _dialog: MatDialog,
    private _router: Router,
    private _platformLocation: PlatformLocation) 
    {
    }
  
  async ngOnInit(): Promise<void> 
  {
    this.encodeUserDataSource = new EncodeUsersDataSource(this._encodeFirestoreService);
    this.encodeUserDataSource.loadUsers(PAGE_SIZE);

    // Get total number of users
    const counter = await this._encodeFirestoreService.getEncodeMetadataCounter();
    this.totalTestsCounter.count = counter.data().count;
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

  ngOnDestroy(): void {
    this.encodeUserDataSource.disconnect();
  }

  private _loadTestsPage() {
    if (this._pageIndex < this._paginator.pageIndex){
      this.encodeUserDataSource.loadNextPage(PAGE_SIZE);
      this._pageIndex = this._paginator.pageIndex;
      return;
    }

    this.encodeUserDataSource.loadPrevPage(PAGE_SIZE);
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
      this.totalTestsCounter.count++;
      this.encodeUserDataSource.loadUsers(PAGE_SIZE);
      this.isLoading = false;
    }
  }

  public getUserResults(uid) {
    if (this._encodeUserService.user?.uid != uid) {
      this._encodeUserService.user = this.encodeUserDataSource.getUserData(uid);
    }
    
    this._router.navigate(['/admin/encode/', uid]);
  }

  public async downloadCSV() {
    const usersQuery = await this._encodeFirestoreService.getAllEncodeUsersData();
    const encodeUsers = usersQuery.docs.map(doc => doc.data());
    let temp = JSON.parse(JSON.stringify(encodeUsers));
    let downloadPrefix = (this._platformLocation as any).location.origin + "/admin/encode/";
    for (let i = 0; i < temp.length; i++) {
      temp[i].link_audios = downloadPrefix + temp[i].uid + "/audios";
      temp[i].creationDate = new Date(temp[i].creationDate.seconds*1000);
    }

    let csvString = this.generateCSV(temp);
    this.openDownloadWindow(csvString);
  }

  private openDownloadWindow(csvString: string) {
    // Download
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }

  private generateCSV(temp: string): string {
    const flatOptions = transforms.flatten({ objects: true, arrays: true, separator: CSV_SEPARATOR });
    const json2csvParser = new Parser({ fields: this._csvFields, transforms: [ flatOptions ] });
    
    return json2csvParser.parse(temp);
  }
}
