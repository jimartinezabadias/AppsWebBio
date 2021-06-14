export interface IAudioRecorder {
    isRecording: boolean;
    audioList: Array<any>;
    record(stream: MediaStream): void;
    stopRecording(): void;
}