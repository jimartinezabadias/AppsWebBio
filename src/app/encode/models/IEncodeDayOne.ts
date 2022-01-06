import { SomnolenceDegree } from "../constants";
import { IEncodeAudio } from "./IEncodeAudio";

export interface IEncodeDayOne {
    somnolenceDegree: SomnolenceDegree;
    audios: Array<IEncodeAudio> | null;
    completed: boolean | null;
}