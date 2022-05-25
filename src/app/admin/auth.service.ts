import { Injectable, Optional } from "@angular/core";
import { Router } from "@angular/router";

import { doc, Firestore, collection, CollectionReference, getDoc } from '@angular/fire/firestore';
import { Auth, authState, GoogleAuthProvider, signInWithPopup, signOut, User } from "@angular/fire/auth";

import { EMPTY, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public readonly user$: Observable<User | null> = EMPTY;
    private _adminUserCollectionRef: CollectionReference;
    
    constructor(
        @Optional() private _auth: Auth,
        private _firestore: Firestore,
        private _router: Router
    )
    {
        this.user$ = authState(this._auth);
        this._adminUserCollectionRef = collection(this._firestore, "admin-users");
    }

    async googleLogin()
    {
        const credential = await signInWithPopup(this._auth, new GoogleAuthProvider());
        return this._verifyUserIsAdmin(credential.user);
    }

    async signOut()
    {
        await signOut(this._auth);
        this._router.navigate(["/"]);
    }

    private async _verifyUserIsAdmin(user: User)
    {
        const userDocRef = doc(this._adminUserCollectionRef,user.uid);
        const docSnap = await getDoc(userDocRef);
        
        if (docSnap.exists())
        {
            return;
        }
        
        this.signOut();
    }
}
