import { IEncodeSuspect } from "./IEncodeSuspect";

export interface IEncodeInMemorySuspect extends IEncodeSuspect {
    photoDownloadUrl: string|null;
}
