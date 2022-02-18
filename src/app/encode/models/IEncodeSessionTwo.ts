import { PerpetratorCondition, PERPETRATOR_1_ID, PERPETRATOR_2_ID,  SomnolenceDegree } from "../constants";
import { IEncodeIdentificationResponse } from "./IEncodeIdentificationResponse";
import { IEncodeImageSelectionResponse } from "./IEncodeImageSelectionResponse";
import { IEncodeAudio } from "./IEncodeAudio";

export interface IEncodeSessionTwo {
    somnolenceDegree: SomnolenceDegree;
    // todo
    // usar un array de dos posiciones para representar la condicion ?
    // perpetratorCondition: Array<typeof PERPETRATOR_1_ID | typeof PERPETRATOR_2_ID>;
    perpetratorCondition: PerpetratorCondition | null;
    imageSelectionResponse: IEncodeImageSelectionResponse[] | null;
    audios: Array<IEncodeAudio> | null;
    identificationResponse:  IEncodeIdentificationResponse[] | null;
    completed: boolean | null;
}
