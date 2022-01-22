import { PerpetratorId } from "../constants";

export interface IEncodeSuspect {
    photo: string;
    isPerpetrator: boolean;
    suspectOfBeing: PerpetratorId
}
