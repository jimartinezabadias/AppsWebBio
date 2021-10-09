import { firestore } from "firebase";

// EncodeUser stored in DB
export interface IEncodeUser {
    uid: string | null;
    name: string;
    email: string;
    creationDate: Date | firestore.FieldValue | null;
    googleFormsPreFilledURLs: string[] | null;
}