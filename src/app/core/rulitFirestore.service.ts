import { Injectable } from '@angular/core';
import { collection, CollectionReference, doc, DocumentSnapshot, Firestore, getDoc, getDocs, orderBy, query, QuerySnapshot } from '@angular/fire/firestore';
import { IRulitSettings, IRulitSolutionSettings } from '../rulit/bits/IRulitSettings';
import { IRulitUser } from '../rulit/bits/RulitUserService';


@Injectable({
  providedIn: 'root'
})
export class RulitFirestoreService {
  
    private _rulitConfigCollectionRef: CollectionReference<IRulitSettings>;
    private _rulitSolutionsCollectionRef: CollectionReference<IRulitSolutionSettings>;
    private _rulitUserCollectionRef: CollectionReference<IRulitUser>;

    constructor(
        private _firestore: Firestore
    ) 
    {
        this._rulitConfigCollectionRef = collection(this._firestore, "rulit-config") as CollectionReference<IRulitSettings>;
        this._rulitSolutionsCollectionRef = collection(this._firestore, "rulit-solutions") as CollectionReference<IRulitSolutionSettings>;
        this._rulitUserCollectionRef = collection(this._firestore, "rulit-users") as CollectionReference<IRulitUser>;
    }

    public getRulitSettings(): Promise<DocumentSnapshot<IRulitSettings>> {
        const settingsDocRef = doc(this._rulitConfigCollectionRef,"config");
        return getDoc(settingsDocRef);
    }

    public getRulitSolutionSettings(solutionCode: string): Promise<DocumentSnapshot<IRulitSolutionSettings>> {
        const solutionSettingsDocRef = doc(this._rulitSolutionsCollectionRef,solutionCode);
        return getDoc(solutionSettingsDocRef);
    }

    public getAllRulitUsersData(): Promise<QuerySnapshot<IRulitUser>> {
        const q = query(this._rulitUserCollectionRef, orderBy("trainingDate", "desc"));
        return getDocs(q);
    }
}
