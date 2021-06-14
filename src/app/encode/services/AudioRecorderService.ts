import { Injectable } from "@angular/core";
import { IAudioRecorder } from "./IAudioRecorderService";

@Injectable({
    providedIn: 'root'
})
export class AudioRecorderService implements IAudioRecorder {
    
    isRecording: boolean = false;
    audioList: any[];

    constructor()
    {
    }    
    
    record(): void {
        this.isRecording = true;
        console.log("recording...");
    }
    
    stopRecording(): void {
        this.isRecording = false;
        console.log("recording has stoped");
    }

}