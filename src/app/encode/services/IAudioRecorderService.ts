export interface IAudioRecorder {
    isRecording: boolean;
    audioCount: number;
    record(stream: MediaStream): void;
    stopRecording(): void;
    getAudio(index: number): any | null;
    getAudios(): Array<any>;
}