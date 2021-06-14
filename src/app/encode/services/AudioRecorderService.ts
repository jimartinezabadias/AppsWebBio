import { Injectable } from "@angular/core";
import { IAudioRecorder } from "./IAudioRecorderService";

@Injectable({
    providedIn: 'root'
})
export class AudioRecorderService implements IAudioRecorder {
    
    isRecording: boolean = false;
    audioList: any[];

    private _options = {mimeType: 'audio/webm'};

    constructor()
    {
    }    
    
    record(stream: MediaStream): void {
        this.isRecording = true;
        console.log("recording...");

        const recordedChunks = [];
        const mediaRecorder = new MediaRecorder(stream, this._options);

        // mediaRecorder.addEventListener('dataavailable', function(e) {
        // if (e.data.size > 0) {
        //     recordedChunks.push(e.data);
        // }

        // if(shouldStop === true && stopped === false) {
        //     mediaRecorder.stop();
        //     stopped = true;
        // }
        // });

        // mediaRecorder.addEventListener('stop', function() {
        // downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
        // downloadLink.download = 'acetest.wav';
        // });

        // mediaRecorder.start();
    }
    
    stopRecording(): void {
        this.isRecording = false;
        console.log("recording has stoped");
    }

}