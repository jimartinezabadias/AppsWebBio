import { DocumentReference } from "@angular/fire/firestore";
import { IEncodeSuspect } from "./IEncodeSuspect";
import { IEncodeScreenshot } from "./IEncodeScreenshot";

export interface IEncodeTasksResources {
    perpetrator1Suspects: Array<DocumentReference<IEncodeSuspect>>;
    perpetrator2Suspects: Array<DocumentReference<IEncodeSuspect>>;
    screenshotsPairs: Array<DocumentReference<IEncodeScreenshot>>;
}
