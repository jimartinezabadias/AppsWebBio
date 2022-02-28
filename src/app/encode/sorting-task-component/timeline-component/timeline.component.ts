import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { MAX_TIMELINE_SCREENSHOTS } from '../../constants';
import { IEncodeScreenshot } from '../../models/IEncodeScreenshot';

@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['timeline.component.scss']
})
export class EncodeTimelineComponent {

  public timeline =  new Array<IEncodeScreenshot | null>(MAX_TIMELINE_SCREENSHOTS);

  @Input() 
  set timeline$(timeline$: Observable<Array<IEncodeScreenshot | null>>) {
    timeline$.subscribe(this._onTimelineChange);
  }

  @Output()
  public removeScreenshotFromTimelineEvent = new EventEmitter<IEncodeScreenshot>();
  
  constructor()
  {
  }

  public removefromTimeline(screenshot: IEncodeScreenshot): void {
    this.removeScreenshotFromTimelineEvent.emit(screenshot);
  }

  private _onTimelineChange = (newTimeline: Array<IEncodeScreenshot | null>): void => {
    this.timeline = newTimeline;
  }

}
