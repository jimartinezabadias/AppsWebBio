import { firestore } from "firebase";
import { IEncodeGoogleFormResponse } from "./IEncodeGoogleFormResponse";

// EncodeUser stored in DB
export interface IEncodeUser {
    uid: string | null;
    name: string;
    email: string;
    creationDate: Date | firestore.FieldValue | null;
    googleFormsResponses: IEncodeGoogleFormResponse[] | null;
}