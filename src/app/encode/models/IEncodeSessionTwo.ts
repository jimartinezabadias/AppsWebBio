import { PerpetratorCondition, SomnolenceDegree } from "../constants";
import { IEncodeIdentificationResponse } from "./IEncodeIdentificationResponse";
import { IEncodeAudio } from "./IEncodeAudio";
import { IEncodeScreenshot } from "./IEncodeScreenshot";

export interface IEncodeSessionTwo {
    somnolenceDegree: SomnolenceDegree;
    // todo
    // usar un array de dos posiciones para representar la condicion ?
    // perpetratorCondition: Array<typeof PERPETRATOR_1_ID | typeof PERPETRATOR_2_ID>;
    perpetratorCondition: PerpetratorCondition | null;
    imageSelectionResponse: IEncodeScreenshot[] | null;
    audios: Array<IEncodeAudio> | null;
    identificationResponse:  IEncodeIdentificationResponse[] | null;
    completed: boolean | null;
}
