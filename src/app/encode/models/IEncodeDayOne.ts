import { SomnolenceDegrees } from "../constants";
import { IEncodeAudio } from "./IEncodeAudio";

export interface IEncodeDayOne {
    somnolenceDegree: SomnolenceDegrees;
    audios: Array<IEncodeAudio> | null;
}