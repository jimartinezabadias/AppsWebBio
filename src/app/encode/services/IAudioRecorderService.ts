import { Subject } from "rxjs";

export interface IAudioRecorder {
    isRecording: boolean;
    audioCount: number;
    audioListChanged$: Subject<boolean>;
    record(stream: MediaStream): void;
    stopRecording(): void;
    getAudioAt(index: number): Blob | null;
    getAudios(): Array<Blob>;
}