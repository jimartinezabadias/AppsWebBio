import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { IEncodeScreenshot } from '../../models/IEncodeScreenshot';

@Component({
    selector: 'app-grid-image',
    templateUrl: './grid-image.component.html',
    styleUrls: ['grid-image.component.scss']
})
export class EncodeGridImageComponent {

  private _screenshot: IEncodeScreenshot;
  private _timeline$: Observable<IEncodeScreenshot[]>;
  
  public isSelected: boolean = false;
  
  @Input() 
  set screenshot(screenshot: IEncodeScreenshot) {
    this._screenshot = screenshot;
  };
  
  get imageURL (): string {
    return this._screenshot.imageURL;
  }
  
  @Input() 
  set timeline$(timeline$: Observable<IEncodeScreenshot[]>) {
    this._timeline$ = timeline$;
    this._timeline$.subscribe(this._onTimelineChange);
  }

  @Output()
  public addScreenshotToTimelineEvent = new EventEmitter<IEncodeScreenshot>();

  constructor()
  {
  }

  public addToTimeline() {
    this.addScreenshotToTimelineEvent.emit(this._screenshot);
  }

  private _onTimelineChange = (newTimeline: Array<IEncodeScreenshot>): void => {
    this.isSelected = false;
    newTimeline.forEach( (screenshot: IEncodeScreenshot) => {
      if (screenshot.id === this._screenshot.id) this.isSelected = true;
    }); 
  }
}
