import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import { EncodeUserService } from 'src/app/encode/services/EncodeUserService';
import { EncodeUsersDataSource } from './encodeUsersDataSource';
import { InviteFormComponent } from './invite-form-component/invite-form.component';
import { Router } from '@angular/router';
import { Parser, transforms } from 'json2csv';
import { PlatformLocation } from '@angular/common';


const SEPARATOR = "_";

@Component({
  selector: 'app-admin-encode',
  templateUrl: './admin-encode.component.html',
  styleUrls: ['admin-encode.component.scss','../admin.component.scss'],
})
export class AdminEncodeComponent implements OnInit {

  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  private _pageIndex: number = 0;
  private _csvFields = [
    "uid",
    "name",
    "email",
    "creationDate",
    "abandonedByUser",
    "consent_hasAccepted",
    "consent_date",
    "personalInfo_age",
    "personalInfo_educationLevel",
    "personalInfo_gender",
    "personalInfo_occupation",
    "personalInfo_ongoingCareer",
    "healthInfo_cronicMedicines",
    "healthInfo_hasSleepDisorder",
    "healthInfo_sleepDisorders",
    "healthInfo_takesCronicMedicine",
    "sessionOne_completed",
    "sessionOne_somnolenceDegree",
    "sessionTwo_completed",
    "sessionTwo_somnolenceDegree",
    "sessionTwo_perpetratorCondition",
    "googleFormsResponses_0_isResponded",
    "googleFormsResponses_1_isResponded",
    "googleFormsResponses_2_isResponded",
    "googleFormsResponses_3_isResponded",
    "googleFormsResponses_4_isResponded",
    "googleFormsResponses_5_isResponded",
    "sessionTwo_identificationResponse_0_confidenceLevel",
    "sessionTwo_identificationResponse_0_selectedSuspect_id",
    "sessionTwo_identificationResponse_0_selectedSuspect_isPerpetrator",
    "sessionTwo_identificationResponse_1_confidenceLevel",
    "sessionTwo_identificationResponse_1_selectedSuspect_id",
    "sessionTwo_identificationResponse_1_selectedSuspect_isPerpetrator",
    "sessionTwo_imageSelectionResponse_0_id",
    "sessionTwo_imageSelectionResponse_1_id",
    "sessionTwo_imageSelectionResponse_2_id",
    "sessionTwo_imageSelectionResponse_3_id",
    "sessionTwo_imageSelectionResponse_4_id",
    "sessionTwo_imageSelectionResponse_5_id",
    "sessionTwo_imageSelectionResponse_6_id",
    "sessionTwo_imageSelectionResponse_7_id",
    "sessionTwo_imageSortingResponse_0_id",
    "sessionTwo_imageSortingResponse_1_id",
    "sessionTwo_imageSortingResponse_2_id",
    "sessionTwo_imageSortingResponse_3_id",
    "sessionTwo_imageSortingResponse_4_id",
    "sessionTwo_imageSortingResponse_5_id",
    "sessionTwo_imageSortingResponse_6_id",
    "sessionTwo_imageSortingResponse_7_id",
    "link_audios"
  ];

  public usersDataSource: EncodeUsersDataSource;
  public totalTestsCounter: any = { count: -1 };
  public pageSize: number = 5;
  public isLoading: boolean = false

  // Columnas de la tabla que se van a mostrar
  public displayedColumns: string[] = ["name", "email", "link" ,"creationDate" ];
  
  constructor(
    private _encodeUserService: EncodeUserService,
    private _dialog: MatDialog,
    private _dbService: DataDbService,
    private _router: Router,
    private _platformLocation: PlatformLocation) {}
  
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

    dialogRef.afterClosed().subscribe(this._inviteDialogClosed$);
  }

  public getUserResults(uid) {
    this._router.navigate(['/admin/encode/', uid]);
  }

  public async downloadCSV() {
    let encodeUsers = await this._dbService.getAllEncodeUsersData();
    let temp = JSON.parse(JSON.stringify(encodeUsers));
    let downloadPrefix = (this._platformLocation as any).location.origin + "/admin/encode/";
    for (let i = 0; i < temp.length; i++) {
      temp[i].link_audios = downloadPrefix + temp[i].uid + "/audios";
      temp[i].creationDate = new Date(temp[i].creationDate.seconds*1000);
    }

    let csvString = this.generateCSV(temp);
    this.openDownloadWindow(csvString);
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
