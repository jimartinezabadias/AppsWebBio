import { Injectable } from "@angular/core";
import { fromEvent, Subject } from "rxjs";
import { REC_OPTIONS } from "../constants";
import { IAudioRecorder } from "./IAudioRecorderService";

@Injectable({
    providedIn: 'root'
})
export class AudioRecorderService implements IAudioRecorder {
    
    private _audioList: Array<Blob>;
    private _mediaRecorder: MediaRecorder;
    private _recordedChunks;
    
    isRecording: boolean;
    audioListChanged$: Subject<boolean>;
    
    constructor()
    {
        this._audioList = new Array();
        this.isRecording = false;
        this.audioListChanged$ = new Subject<boolean>();
        this._recordedChunks = new Array();
    }

    get audioCount(): number
    {
        return this._audioList.length;
    }
    
    record(stream: MediaStream): void 
    {
        this._mediaRecorder = new MediaRecorder(stream, REC_OPTIONS);
        this.isRecording = true;

        const dataAvailable$ = fromEvent(this._mediaRecorder,"dataavailable");
        dataAvailable$.subscribe((e: BlobEvent) => {
            if (e.data.size > 0)
            {
                this._recordedChunks.push(e.data);
            }
        });

        const stop$ = fromEvent(this._mediaRecorder,"stop");
        stop$.subscribe((e: Event) => {
            this._audioList.push(new Blob(this._recordedChunks, {type: "audio/webm"}));
            this.audioListChanged$.next(true);
            this._recordedChunks = new Array();
        });

        this._mediaRecorder.start();
    }
    
    stopRecording(): void 
    {
        this.isRecording = false;
        this._mediaRecorder.stop();
    }

    getAudioAt(index: number): Blob | null
    {
        if (this._audioList.length > index)
        {
            return this._audioList[index];
        }

        return null;
    }

    getAudios(): Array<Blob>
    {
        return this._audioList;
    }

    deleteAudioAt(index: number): void {
        if (this._audioList.length > index)
        {   
            this._audioList.splice(index,1);
        }
    }

}