import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import firebase from "firebase/compat/app";

import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";


import { IAdminUser } from "./IAdminUser.model";
import { lastValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user$: any;
    private _adminUserCollectionRef: AngularFirestoreCollection;
    
    constructor(
        private _afAuth: AngularFireAuth,
        private _afs: AngularFirestore,
        private _router: Router
    )
    {
        this.user$ = this._afAuth.authState;
        this._adminUserCollectionRef = this._afs.collection<IAdminUser>("admin-users");
    }

    async googleLogin()
    {
        const provider = new firebase.auth.GoogleAuthProvider();
        const credential = await this._afAuth.signInWithPopup(provider);
        return this._verifyUserIsAdmin(credential.user);
    }

    async signOut()
    {
        await this._afAuth.signOut();
        this._router.navigate(["/"]);
    }

    private async _verifyUserIsAdmin(user: firebase.User)
    {
        const userRef$ = this._adminUserCollectionRef.doc<IAdminUser>(user.uid).get();
        const userRef = await lastValueFrom(userRef$);
        if (userRef.exists)
        {
            return;
        }
        
        this.signOut();
    }
}
