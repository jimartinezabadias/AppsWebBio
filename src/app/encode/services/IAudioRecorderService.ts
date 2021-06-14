export interface IAudioRecorder {
    isRecording: boolean;
    audioList: Array<any>;
    record(): void;
    stopRecording(): void;
}