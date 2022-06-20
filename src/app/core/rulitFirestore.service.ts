import { Injectable } from '@angular/core';
import { collection, CollectionReference, doc, DocumentReference, DocumentSnapshot, Firestore, getDoc, getDocs, orderBy, query, QuerySnapshot, serverTimestamp, setDoc } from '@angular/fire/firestore';
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

    public getNewRulitDocumentRef(): DocumentReference {
        const userDocRef = doc(this._rulitUserCollectionRef);
        return userDocRef;
    }

    public getRulitUserData(userId: string): Promise<DocumentSnapshot<IRulitUser>> {
        const userDocRef = doc(this._rulitUserCollectionRef,userId);
        return getDoc(userDocRef);
    }

    public saveRulitUserData(user: IRulitUser): Promise<void> {
    
        if ( user.nextTest === "long_memory_test" )
          user.trainingDate = serverTimestamp();
        
        if ( user.nextTest === "no_next_test" )
          user.testDate = serverTimestamp();
    
        const userDocRef = doc(this._rulitUserCollectionRef, user.userId);
        return setDoc(userDocRef, user);
    }
}
