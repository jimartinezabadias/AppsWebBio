import { Injectable } from "@angular/core";
import { fromEvent, Subject } from "rxjs";
import { REC_OPTIONS } from "../constants";
import { IEncodeAudio } from "../models/IEncodeAudio";
import { IAudioRecorder } from "./IAudioRecorderService";

@Injectable({
    providedIn: 'root'
})
export class AudioRecorderService implements IAudioRecorder {
    
    private _audioList: Array<IEncodeAudio>;
    private _mediaRecorder: MediaRecorder;
    private _recordedChunks;
    
    public isRecording: boolean;
    public audioListChanged$: Subject<IEncodeAudio>;
    
    constructor()
    {
        this._audioList = new Array<IEncodeAudio>();
        this.isRecording = false;
        this.audioListChanged$ = new Subject<IEncodeAudio>();
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
            const audioData: Blob = new Blob(this._recordedChunks, {type: "audio/webm"});
            const newAudio: IEncodeAudio = { id: null, rawData: audioData};
            this._audioList.push(newAudio);
            this.audioListChanged$.next(newAudio);
            this._recordedChunks = new Array();
        });

        this._mediaRecorder.start();
    }
    
    stopRecording(): void 
    {
        this.isRecording = false;
        this._mediaRecorder.stop();
    }

    getAudioAt(index: number): IEncodeAudio | null
    {
        if (this._audioList.length > index)
        {
            return this._audioList[index];
        }

        return null;
    }

    getAudios(): Array<IEncodeAudio>
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