import { Subject } from "rxjs";

export interface IAudioRecorder {
    isRecording: boolean;
    audioCount: number;
    audioListChanged$: Subject<boolean>;
    record(stream: MediaStream): void;
    stopRecording(): void;
    getAudio(index: number): any | null;
    getAudios(): Array<any>;
}