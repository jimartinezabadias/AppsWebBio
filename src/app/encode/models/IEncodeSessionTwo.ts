import { PerpetratorCondition, PERPETRATOR_1_ID, PERPETRATOR_2_ID,  SomnolenceDegree } from "../constants";
import { IEncodeIdentificationResponse } from "./IEncodeIdentificationResponse";
import { IEncodeImageSelectionResponse } from "./IEncodeImageSelectionResponse";

export interface IEncodeSessionTwo {
    somnolenceDegree: SomnolenceDegree;
    perpetratorCondition: PerpetratorCondition | null;
    imageSelectionResponse: IEncodeImageSelectionResponse[] | null;
    identificationResponse: Map< typeof PERPETRATOR_1_ID | typeof PERPETRATOR_2_ID , IEncodeIdentificationResponse> | null;
    completed: boolean | null;
}
