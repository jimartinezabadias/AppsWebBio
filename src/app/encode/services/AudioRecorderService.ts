import { Injectable } from "@angular/core";
import { fromEvent, Subject } from "rxjs";
import { IAudioRecorder } from "./IAudioRecorderService";

@Injectable({
    providedIn: 'root'
})
export class AudioRecorderService implements IAudioRecorder {
    
    private _audioList: Array<any>;
    private _options = {mimeType: 'audio/webm'};
    private _mediaRecorder: MediaRecorder;
    private _recordedChunks = [];
    
    isRecording: boolean;
    audioCount: number;
    audioListChanged$: Subject<boolean>;
    
    constructor()
    {
        this._audioList = new Array();
        this.isRecording = false;
        this.audioCount = 0;
        this.audioListChanged$ = new Subject<boolean>();
    }    
    
    record(stream: MediaStream): void 
    {
        this._mediaRecorder = new MediaRecorder(stream, this._options);
        this.isRecording = true;
        console.log("recording...");

        const dataAvailable$ = fromEvent(this._mediaRecorder,"dataavailable");
        dataAvailable$.subscribe((e: BlobEvent) => {
            console.log("data available");
            console.log(e.data);
            if (e.data.size > 0)
            {
                this._recordedChunks.push(e.data);
            }
        });

        const stop$ = fromEvent(this._mediaRecorder,"stop");
        stop$.subscribe((e: Event) => {
            this._audioList.push(new Blob(this._recordedChunks, {type: "audio/webm"}));
            this.audioListChanged$.next(true);
        });

        this._mediaRecorder.start();
    }
    
    stopRecording(): void 
    {
        this.isRecording = false;
        this._mediaRecorder.stop();
        
        console.log("recording has stoped");
    }

    getAudio(index: number): any | null
    {
        if (index > this._audioList.length)
        {
            return this._audioList[index];
        }
        return null;
    }

    getAudios(): Array<any>
    {
        return this._audioList;
    }

}