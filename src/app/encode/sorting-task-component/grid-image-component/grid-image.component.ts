import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { IEncodeScreenshot } from '../../models/IEncodeScreenshot';
import { EncodeFullImageComponent } from './full-image-component/full-image.component';

@Component({
    selector: 'app-grid-image',
    templateUrl: './grid-image.component.html',
    styleUrls: ['grid-image.component.scss']
})
export class EncodeGridImageComponent {

  private _screenshot: IEncodeScreenshot;
  
  public isSelected: boolean = false;
  
  @Input() 
  set screenshot(screenshot: IEncodeScreenshot) {
    this._screenshot = screenshot;
  };
  
  get imageURL (): string {
    return this._screenshot.imageURL;
  }
  
  @Input() 
  set timeline$(timeline$: Observable<Array<IEncodeScreenshot | null>>) {
    timeline$.subscribe(this._onTimelineChange);
  }

  @Output()
  public addScreenshotToTimelineEvent = new EventEmitter<IEncodeScreenshot>();

  constructor(private _dialogService: MatDialog)
  {
  }

  public addToTimeline(): void {
    this.addScreenshotToTimelineEvent.emit(this._screenshot);
  }

  public openInFull(): void {
    const options: MatDialogConfig = { panelClass: "full-image-overlay"};
    const imageDialogRef = this._dialogService.open(EncodeFullImageComponent);
    imageDialogRef.componentInstance.imageUrl = this.imageURL;
  }

  private _onTimelineChange = (newTimeline: Array<IEncodeScreenshot | null>): void => {
    this.isSelected = false;
    newTimeline.forEach( (screenshot: IEncodeScreenshot | null) => {
      if (screenshot?.id === this._screenshot.id) this.isSelected = true;
    }); 
  }
}
