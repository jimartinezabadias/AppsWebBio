import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import { EncodeUserService } from 'src/app/encode/services/EncodeUserService';
import { EncodeUsersDataSource } from './encodeUsersDataSource';
import { InviteFormComponent } from './invite-form-component/invite-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Parser, transforms } from 'json2csv';

const SEPARATOR = "_";

@Component({
  selector: 'app-admin-encode',
  templateUrl: './admin-encode.component.html',
  styleUrls: ['admin-encode.component.scss','../admin.component.scss'],
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
    private _dbService: DataDbService,
    private _router: Router,
    private _route: ActivatedRoute) {}
  
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

  public getUserResults(uid) {
    this._router.navigate(['/admin/encode/', uid]);
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

  async getData() {
    let encodeUsers = await this._dbService.getAllEncodeUsersData();
    let temp = JSON.parse(JSON.stringify(encodeUsers));
    let prefix = window.location.href.replace("/encode", "") + "/audios/";
    for (let i = 0; i < temp.length; i++) {
      temp[i].link_audios = prefix + temp[i].uid;
    }
    // CSV
    const flatOptions = transforms.flatten({ objects: true, arrays: true, separator: SEPARATOR });
    let fields = this._getFields();
    const json2csvParser = new Parser({ fields: fields, transforms: [ flatOptions ] });
    const csv = json2csvParser.parse(temp);
    console.log(json2csvParser.parse(temp));
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }

  // Returns the column names of the csv in the correct order
  private _getFields(): Array<string> {

    // Set static fields
    let fields = [
      "uid",
      "name",
      "email",
      "creationDate",
      "abandonedByUser",
      "personalInfo_age",
      "personalInfo_educationLevel",
      "personalInfo_gender",
      "personalInfo_occupation",
      "personalInfo_ongoingCareer",
      "healthInfo_cronicMedicines",
      "healthInfo_hasSleepDisorder",
      "healthInfo_sleepDisorders",
      "healthInfo_takesCronicMedicine",
      "dayOne_somnolenceDegree",
      "link_audios"
    ];

    return fields;

  }

}
