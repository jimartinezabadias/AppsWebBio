import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncodeUserService } from '../services/EncodeUserService';
import { IEncodeImageSelectionResponse } from "../models/IEncodeImageSelectionResponse";
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import { DocumentReference } from '@angular/fire/firestore';
import { IEncodeScreenshot } from '../models/IEncodeScreenshot';
import { IEncodeScreenshotPair } from '../models/IEncodeScreenshotPair';

@Component({
    selector: 'app-encode-selection',
    templateUrl: './selection.component.html',
    styleUrls: ['selection.component.scss','../encode.component.scss']
})
export class EncodeSelectionComponent implements OnInit {
  public imagesPairs;
  public steps = 12;
  public random_pairs = [];
  public currentStep = 0;
  public selectionMade = false;
  public userChoices: Array<IEncodeImageSelectionResponse> = [];
  public userChoice: IEncodeImageSelectionResponse;
  public imagesPairsLoaded = false;

  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private _dbService: DataDbService,
              private _userService: EncodeUserService) 
  {
  }

  async getScreenshotPairs() 
  {
    const taskResources = await this._dbService.getEncodeTasksResources();
    
    let pairs_temp = [];

    this.imagesPairs = await this._getScreenshot(taskResources.screenshotsPairs);

    
    let pair = 0;
    for (let i = 1; i <= this.imagesPairs.length; i+=2) {
      pair++;
      let newPair: IEncodeScreenshotPair = {
        pairNumber: pair,
        fakeImage: await this._dbService.getCloudStorageFileRef(this.imagesPairs[i].imageStorageRef).getDownloadURL().toPromise<string>(),
        realImage: await this._dbService.getCloudStorageFileRef(this.imagesPairs[i-1].imageStorageRef).getDownloadURL().toPromise<string>()
      };
      
      pairs_temp.push(newPair);
    }
    
    this.imagesPairs = pairs_temp;
    //this.imagesPairs = Object.entries(this.imagesPairs).map(([type, value]) => ({type, value}));
    console.log(this.imagesPairs);
    this.imagesPairsLoaded = true;
  }

  ngOnInit() 
  {
    this.getScreenshotPairs();

    for (let i = 0; i <= this.steps; i++) {
      this.random_pairs.push(Math.floor(Math.random() * (1 - 0 + 1) + 0));
    }

    console.log(this.random_pairs);
  }

  onSelection(selectionValue, isReal): any
  {
    this.userChoice = { pairNumber: this.currentStep, isReal: isReal, imageURL: selectionValue };
    this.selectionMade = true;
  }

  onConfirm(): any 
  {
    if (this.currentStep < 13) {
      this.userChoices.push(this.userChoice);
      this.currentStep = this.currentStep + 1;
      this.selectionMade = false;
    } else if (this.currentStep == 13) {
      this._userService.user.sessionTwo.imageSelectionResponse = this.userChoices;
      //routear a ordenamiento
      //this._router.navigate(["../consent"], { relativeTo: this._route });
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
