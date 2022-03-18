import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { OnExit } from '../exit.guard';
import { Observable, Subject } from 'rxjs';
import { IEncodeScreenshot } from '../models/IEncodeScreenshot';
import { MAX_TIMELINE_SCREENSHOTS } from '../constants';
import { EncodeUserService } from '../services/EncodeUserService';
import { MatDialog } from '@angular/material/dialog';
import { ExitConfirmComponent } from '../exit-confirm-component/exit-confirm.component';

@Component({
    selector: 'app-sorting-task',
    templateUrl: './sorting-task.component.html',
    styleUrls: ['sorting-task.component.scss','../encode.component.scss']
})
export class EncodeSortingTaskComponent implements OnInit, OnExit {
  
  private _timeline = new Array<IEncodeScreenshot | null>(MAX_TIMELINE_SCREENSHOTS).fill(null);
  private _timelineSubject = new Subject<Array<IEncodeScreenshot | null>>();

  public isTaskRunning: boolean = false;
  public lineup: Array<IEncodeScreenshot>;
  public timeline$: Observable<Array<IEncodeScreenshot | null>>;

  get isTimelineCompleted(): boolean {
    const filledSlots = this._timeline.filter(screenshot => screenshot != null).length;
    return filledSlots == MAX_TIMELINE_SCREENSHOTS;
  }

  constructor(private _userService: EncodeUserService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _dialog: MatDialog)
  {
  }

  onExit(): Observable<boolean> | Promise<boolean> | boolean {
    const exitDialogRef = this._dialog.open(ExitConfirmComponent);
    exitDialogRef.afterClosed().subscribe(this._exitDialogClosed$);
    return exitDialogRef.afterClosed().toPromise<boolean>();
  }

  private _exitDialogClosed$ = async (response: boolean): Promise<boolean> => {
    if (response == true){ 
      await this._userService.abandonTest();
      this._router.navigate(["/"]);
    } 

    return false;
  }

  ngOnInit(): void {
    this.lineup = this._userService.user.sessionTwo.imageSelectionResponse;
    this.timeline$ = this._timelineSubject.asObservable();
  }

  public startTask(): void {
    this.isTaskRunning = true;
  }

  public finishTask(): void {
    this._userService.user.sessionTwo.imageSortingResponse = this._timeline;
    this.onExit = () => true;
    this._router.navigate(["../end"], { relativeTo: this._route });
  }

  public onAddScreenshotToTimelineEvent(addedScreenshot: IEncodeScreenshot): void {
    const firstEmptyIndex = this._timeline.indexOf(null);
    
    this._timeline[firstEmptyIndex] = addedScreenshot;
    this._timelineSubject.next(this._timeline);
  }
  
  public onRemoveScreenshotFromTimelineEvent(removedScreenshot: IEncodeScreenshot): void {
    const removedScreenshotIndex = this._timeline
      .findIndex(screenshot => screenshot?.id === removedScreenshot.id);
    
    this._timeline[removedScreenshotIndex] = null;
    this._timelineSubject.next(this._timeline);
  }
}
