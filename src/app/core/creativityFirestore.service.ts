import { Injectable } from '@angular/core';
import { collection, CollectionReference, doc, endBefore, Firestore, getDoc, getDocs, limit, orderBy, query, QuerySnapshot, startAfter, startAt } from '@angular/fire/firestore';
import { CreativeUser } from './models/creative-user.interface';


@Injectable({
  providedIn: 'root'
})
export class CreativityFirestoreService {
  
    private _metadataCollectionRef: CollectionReference;
    private _creativityUsersCollectionRef: CollectionReference<CreativeUser>;
    
    constructor(
        private _firestore: Firestore
    ) 
    {
        this._metadataCollectionRef = collection(this._firestore, "creatives-meta");
        this._creativityUsersCollectionRef = collection(this._firestore, "creatives-users") as CollectionReference<CreativeUser>;
    }

    public getCreativityMetadataCounter() {
        const ref = doc(this._metadataCollectionRef, "tests-counter");
        return getDoc(ref);
    }

    public getFirstPage(pageSize: number = 3): Promise<QuerySnapshot<CreativeUser>> {
        const q = query(this._creativityUsersCollectionRef, orderBy("dateStart", "desc"), limit(pageSize));
        return getDocs(q);
    }

    public getPrevPage(prevFirst, actualFirst, pageSize: number = 3): Promise<QuerySnapshot<CreativeUser>> {
        const q = query(this._creativityUsersCollectionRef, orderBy("dateStart", "desc"), limit(pageSize), startAt(prevFirst), endBefore(actualFirst));
        return getDocs(q);
    }

    public getNextPage(actualLast, pageSize: number = 3): Promise<QuerySnapshot<CreativeUser>> {
        const q = query(this._creativityUsersCollectionRef, orderBy("dateStart", "desc"), limit(pageSize), startAfter(actualLast));
        return getDocs(q);
    }

}
