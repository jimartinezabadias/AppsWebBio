import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncodeUserService } from '../services/EncodeUserService';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { IEncodeScreenshot } from '../models/IEncodeScreenshot';
import { OnExit } from '../exit.guard';
import { MatDialog } from '@angular/material/dialog';
import { ExitConfirmComponent } from '../exit-confirm-component/exit-confirm.component';
import { SCREENSHOTS_COUNT } from '../constants';
import { firstValueFrom } from 'rxjs';


@Component({
    selector: 'app-encode-selection',
    templateUrl: './selection.component.html',
    styleUrls: ['selection.component.scss','../encode.component.scss']
})
export class EncodeSelectionComponent implements OnInit, OnExit {
  public imagesPairs: IEncodeScreenshot[];
  public steps: number = SCREENSHOTS_COUNT;
  public random_pairs = [];
  public currentStep = 0;
  public selectionMade = false;
  public started = false;
  public completed = false;
  public userChoices: Array<IEncodeScreenshot> = [];
  public userChoice: IEncodeScreenshot;
  public imagesPairsLoaded = false;

  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private _dbService: DataDbService,
              private _userService: EncodeUserService,
              private _dialog: MatDialog) 
  {
  }

  async onExit(): Promise<any> {
    const exitDialogRef = this._dialog.open(ExitConfirmComponent);
    exitDialogRef.afterClosed().subscribe(this._exitDialogClosed$);
    const exit$ = exitDialogRef.afterClosed();
    return await firstValueFrom(exit$);
  }

  private _exitDialogClosed$ = async (response: boolean): Promise<boolean> => {
    if (response == true){ 
      await this._userService.abandonTest();
      this._router.navigate(["/"]);
    } 

    return false;
  }

  async getScreenshotPairs() 
  {
    const taskResources = await this._dbService.getEncodeTasksResources();
    this.imagesPairs = await this._getScreenshot(taskResources.screenshotsPairs);

    this.imagesPairs.forEach( async (screenshot: IEncodeScreenshot, index) => {
      screenshot.id = taskResources.screenshotsPairs[index].id;
      const url$ = this._dbService.getCloudStorageFileRef(screenshot.imageStorageRef).getDownloadURL();
      screenshot.imageURL = await firstValueFrom(url$);
    });
      
    let pairNumber = 1;
    this.imagesPairs.forEach( (screenshot: IEncodeScreenshot, index) => {
      screenshot.pairNumber = pairNumber ;
      if ((index % 2) == 1) pairNumber++;
    });

    console.log(this.imagesPairs);
    this.imagesPairsLoaded = true;
  }

  ngOnInit() 
  {
    this.getScreenshotPairs();

    for (let i = 0; i < SCREENSHOTS_COUNT; i++) {
      this.random_pairs.push(Math.floor(Math.random() * (1 - 0 + 1) + 0));
    }

    console.log(this.random_pairs);
  }

  onSelection(image): void
  {
    console.log(image);
    this.userChoice = image;

    this.selectionMade = true;
  }

  continue() {
    if (this.completed == false) {
      if (this.started == false) {
        this.started = true;
      }
    } else {
      //routear a ordenamiento
      this.onExit = async () => true;
      this._router.navigate(["../sorting"], { relativeTo: this._route });
    }
  }

  onConfirm(): any 
  {
    console.log("currentStep: ", this.currentStep)
    if (this.currentStep < SCREENSHOTS_COUNT) {
      this.userChoices.push(this.userChoice);
      this.currentStep = this.currentStep + 1;
      this.selectionMade = false;
    }
    console.log("userChoices: ", this.userChoices)
    if (this.userChoices.length == SCREENSHOTS_COUNT) {
      this.started = false;
      this.completed = true;
      this._userService.user.sessionTwo.imageSelectionResponse = this.userChoices;
    }
  }

  private _getScreenshot(screenshotDocuments: Array<DocumentReference<IEncodeScreenshot>>): Promise<Array<IEncodeScreenshot>> {
    let screenshots = new Array<Promise<IEncodeScreenshot>>();

    screenshotDocuments.forEach( async docRef => {
      const screenshotId = docRef.id;
      const screenshot = this._dbService.getEncodeScreenshot(screenshotId);
      screenshots.push(screenshot);
    });

    return Promise.all(screenshots);
  }

}