import { Component, OnInit } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { OnExit } from '../exit.guard';
import { Observable, Subject } from 'rxjs';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import { IEncodeScreenshot } from '../models/IEncodeScreenshot';

const testResponseConstant: IEncodeScreenshot[] = [
  {
    imageURL: "https://firebasestorage.googleapis.com/v0/b/investigar-664cd.appspot.com/o/encode-resources%2Fselection-task%2F1_realImage.png?alt=media&token=cfc3ccf1-113b-4a40-bd11-9d69ae9d75fb",
    isReal: true,
    pairNumber: 1,
    imageStorageRef: "",
    id: "1"
  },
  {
    imageURL: "https://firebasestorage.googleapis.com/v0/b/investigar-664cd.appspot.com/o/encode-resources%2Fselection-task%2F2_realImage.png?alt=media&token=6b2f80cb-a82f-4df2-b087-c0a1de982437",
    isReal: true,
    pairNumber: 2,
    imageStorageRef: "",
    id: "2"
  },
  {
    imageURL: "https://firebasestorage.googleapis.com/v0/b/investigar-664cd.appspot.com/o/encode-resources%2Fselection-task%2F3_realImage.png?alt=media&token=f2890099-6216-4f52-9d29-488f6eb57caf",
    isReal: true,
    pairNumber: 3,
    imageStorageRef: "",
    id: "3"
  },
  {
    imageURL: "https://firebasestorage.googleapis.com/v0/b/investigar-664cd.appspot.com/o/encode-resources%2Fselection-task%2F4_fakeImage.png?alt=media&token=c93f8a92-26e3-48ad-8223-adda6956929a",
    isReal: false,
    pairNumber: 4,
    imageStorageRef: "",
    id: "4"
  },
  {
    imageURL: "https://firebasestorage.googleapis.com/v0/b/investigar-664cd.appspot.com/o/encode-resources%2Fselection-task%2F5_realImage.png?alt=media&token=48c6ced3-7ff6-4f9b-a11b-fc6cfc5f7b3f",
    isReal: true,
    pairNumber: 5,
    imageStorageRef: "",
    id: "5"
  },
  {
    imageURL: "https://firebasestorage.googleapis.com/v0/b/investigar-664cd.appspot.com/o/encode-resources%2Fselection-task%2F6_fakeImage.png?alt=media&token=a83bbb86-76cf-4155-b7c9-465f6efe8158",
    isReal: false,
    pairNumber: 6,
    imageStorageRef: "",
    id: "6"
  },
  {
    imageURL: "https://firebasestorage.googleapis.com/v0/b/investigar-664cd.appspot.com/o/encode-resources%2Fselection-task%2F7_fakeImage.png?alt=media&token=2cf4f0fb-f0b6-4cbc-aa05-f5690e7dcc21",
    isReal: false,
    pairNumber: 7,
    imageStorageRef: "",
    id: "7"
  },
  {
    imageURL: "https://firebasestorage.googleapis.com/v0/b/investigar-664cd.appspot.com/o/encode-resources%2Fselection-task%2F8_realImage.png?alt=media&token=da20a5ea-2898-40d2-adb0-1b5d36124c04",
    isReal: true,
    pairNumber: 8,
    imageStorageRef: "",
    id: "8"
  },
  {
    imageURL: "https://firebasestorage.googleapis.com/v0/b/investigar-664cd.appspot.com/o/encode-resources%2Fselection-task%2F9_realImage.png?alt=media&token=0f547c85-870f-4c71-b8b8-87bc450c7f91",
    isReal: true,
    pairNumber: 9,
    imageStorageRef: "",
    id: "9"
  },
  {
    imageURL: "https://firebasestorage.googleapis.com/v0/b/investigar-664cd.appspot.com/o/encode-resources%2Fselection-task%2F10_fakeImage.png?alt=media&token=ae417a82-eeaf-4b51-b5f6-1844ec826384",
    isReal: false,
    pairNumber: 10,
    imageStorageRef: "",
    id: "10"
  },
  {
    imageURL: "https://firebasestorage.googleapis.com/v0/b/investigar-664cd.appspot.com/o/encode-resources%2Fselection-task%2F11_fakeImage.png?alt=media&token=a75914eb-f35b-4e6a-b246-9015e554952d",
    isReal: false,
    pairNumber: 11,
    imageStorageRef: "",
    id: "11"
  },
  {
    imageURL: "https://firebasestorage.googleapis.com/v0/b/investigar-664cd.appspot.com/o/encode-resources%2Fselection-task%2F12_fakeImage.png?alt=media&token=6df1a9dd-8cea-4534-859b-0f6ef218a756",
    isReal: false,
    pairNumber: 12,
    imageStorageRef: "",
    id: "12"
  }
];

@Component({
    selector: 'app-sorting-task',
    templateUrl: './sorting-task.component.html',
    styleUrls: ['sorting-task.component.scss','../encode.component.scss']
})
export class EncodeSortingTaskComponent implements OnInit, OnExit {
  
  private _timeline = new Array<IEncodeScreenshot>();
  private _timelineSubject = new Subject<IEncodeScreenshot[]>();

  public isTaskRunning: boolean = false;
  public lineup: Array<IEncodeScreenshot>;
  public timeline$: Observable<IEncodeScreenshot[]>;

  constructor(
    private _dbService: DataDbService,
    private _userService: EncodeUserService,
    private _router: Router,
    private _route: ActivatedRoute)
  {
  }

  ngOnInit(): void {
    // Posta
    // this.lineup = this._userService.user.sessionTwo.imageSelectionResponse;
    
    // Test
    this.lineup = testResponseConstant;

    this.timeline$ = this._timelineSubject.asObservable();
    
    // Test
    this.timeline$.subscribe((updatedTimeline) => {
      console.log("timeline updated");
      console.log(updatedTimeline);
    });
  }

  onExit(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return true;
  }

  public startTask(): void {
    console.log("starting sort task");
    // console.log(this._userService.user.sessionTwo.imageSelectionResponse);
    this.isTaskRunning = true;
  }

  public onAddScreenshotToTimelineEvent(screenshot: IEncodeScreenshot): void {
    this._timeline.push(screenshot);
    this._timelineSubject.next(this._timeline);
  }
}
