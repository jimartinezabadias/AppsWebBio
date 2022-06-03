import { Injectable } from '@angular/core';

import { collection, doc, Firestore, CollectionReference, DocumentReference, getDoc, setDoc, query, orderBy, limit, getDocs, QuerySnapshot } from '@angular/fire/firestore';
import { IEncodeGoogleFormsSettings } from '../encode/models/IEncodeGoogleFormsSettings';
import { IEncodeUser } from '../encode/models/IEncodeUser';


@Injectable({
  providedIn: 'root'
})
export class EncodeFirestoreService {
  
    private _encodeUserCollectionRef: CollectionReference<IEncodeUser>;
    private _encodeConfigCollectionRef: CollectionReference;
    private _metadataCollectionRef: CollectionReference;

    constructor(
        private _firestore: Firestore
    ) { 
        this._encodeUserCollectionRef = collection(this._firestore, "encode-users") as CollectionReference<IEncodeUser>;
        this._encodeConfigCollectionRef = collection(this._firestore, "encode-config");
        this._metadataCollectionRef = collection(this._firestore, "creatives-meta");
    }

    public getEncodeNewUserDocumentRef(): DocumentReference {
        return doc(this._encodeUserCollectionRef);
    }

    async getEncodeGoogleFormsSettings(): Promise<IEncodeGoogleFormsSettings> {
        const docRef = doc(this._firestore, this._encodeConfigCollectionRef.path, "googleFormsSettings");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as IEncodeGoogleFormsSettings;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }

        return null;
    }

    public createNewEncodeUser(user: IEncodeUser, userDocRef: DocumentReference): Promise<void> {
        // const newUserRef = doc(this._encodeUserCollectionRef);
        return setDoc(userDocRef, user);
    }

    public async getEncodeFirstPage(pageSize: number = 3): Promise<QuerySnapshot<IEncodeUser>> {
        const q = query(this._encodeUserCollectionRef, orderBy("creationDate", "desc"), limit(pageSize));
        return await getDocs(q);
    }

    public async getEncodeMetadataCounter() {
        const ref = doc(this._metadataCollectionRef, "encode-counter");
        return await getDoc(ref);
    }

}
