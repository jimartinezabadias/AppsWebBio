import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { HAS_CURSOR_CLASS, MAX_TIMELINE_SCREENSHOTS } from '../../constants';
import { IEncodeScreenshot } from '../../models/IEncodeScreenshot';

@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['timeline.component.scss']
})
export class EncodeTimelineComponent implements AfterViewInit {

  public timeline =  new Array<IEncodeScreenshot | null>(MAX_TIMELINE_SCREENSHOTS).fill(null);

  @ViewChildren('timelineSlot') 
  private _slotList: QueryList<ElementRef<HTMLDivElement>>;

  @Input() 
  set timeline$(timeline$: Observable<Array<IEncodeScreenshot | null>>) {
    timeline$.subscribe(this._onTimelineChange);
  }

  @Output()
  public removeScreenshotFromTimelineEvent = new EventEmitter<IEncodeScreenshot>();
  
  constructor()
  {
  }

  ngAfterViewInit(): void {
    this._updateCursorPosition();
    this._slotList.changes.subscribe(this._updateCursorPosition);
  }

  public removefromTimeline(screenshot: IEncodeScreenshot): void {
    this.removeScreenshotFromTimelineEvent.emit(screenshot);
  }

  private _onTimelineChange = (newTimeline: Array<IEncodeScreenshot | null>): void => {
    this.timeline = newTimeline;
  }

  private _updateCursorPosition = (): void => {
    // clear cursor
    this._slotList.map( slot => slot.nativeElement.classList.remove(HAS_CURSOR_CLASS));

    const firstEmptySlotIndex = this.timeline.indexOf(null);
    let firstEmptySlot = this._slotList.get(firstEmptySlotIndex)?.nativeElement;
    firstEmptySlot?.classList.add(HAS_CURSOR_CLASS);
  }

}
