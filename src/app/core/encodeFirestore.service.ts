import { Injectable } from '@angular/core';

import { collection, doc, Firestore, CollectionReference, DocumentReference, getDoc, setDoc, query, orderBy, limit, getDocs, QuerySnapshot, startAt, endBefore, onSnapshot, docData } from '@angular/fire/firestore';
import { Unsubscribe } from 'firebase/app-check';
import { DocumentSnapshot, startAfter } from 'firebase/firestore';
import { map, Observable } from 'rxjs';
import { IEncodeGoogleFormResponse } from '../encode/models/IEncodeGoogleFormResponse';
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
        return setDoc(userDocRef, user);
    }

    public getEncodeFirstPage(pageSize: number = 3): Promise<QuerySnapshot<IEncodeUser>> {
        const q = query(this._encodeUserCollectionRef, orderBy("creationDate", "desc"), limit(pageSize));
        return getDocs(q);
    }

    public getEncodeMetadataCounter() {
        const ref = doc(this._metadataCollectionRef, "encode-counter");
        return getDoc(ref);
    }

    public getEncodesNextPage(actualLast, pageSize: number = 3): Promise<QuerySnapshot<IEncodeUser>> {
        const q = query(this._encodeUserCollectionRef, orderBy("creationDate", "desc"), limit(pageSize), startAfter(actualLast));
        return getDocs(q);
    }

    public getEncodePrevPage(prevFirst, actualFirst, pageSize: number = 3): Promise<QuerySnapshot<IEncodeUser>> {
        const q = query(this._encodeUserCollectionRef, orderBy("creationDate", "desc"), limit(pageSize), startAt(prevFirst), endBefore(actualFirst));
        return getDocs(q);
    }

    public getEncodeUser(userId: string): Promise<DocumentSnapshot<IEncodeUser>>  {
        const userDocRef = doc(this._encodeUserCollectionRef,userId);
        return getDoc(userDocRef);
    }

    public async updateEncodeUser(user: IEncodeUser): Promise<void> {
        const userDocRef = doc(this._encodeUserCollectionRef, user.uid);
        return setDoc(userDocRef, user);
    }

    // Observable<IEncodeGoogleFormResponse[]>
    public getEncodeGoogleFormsResponses$(userId: string): Observable<IEncodeGoogleFormResponse[]> {
        const userDocRef = doc(this._encodeUserCollectionRef,userId);
        return docData(userDocRef).pipe(map((user: IEncodeUser) => user.googleFormsResponses));
        // return onSnapshot(userDocRef, callback);
        // return this.encodeUserCollectionRef_OLD.doc<IEncodeUser>(userId).valueChanges().pipe(map((user: { googleFormsResponses: any; }) => user.googleFormsResponses));
      }

}
