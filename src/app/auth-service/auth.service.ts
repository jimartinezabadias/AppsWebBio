import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import firebase from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";

import { Observable, of } from "rxjs";

import { IAdminUser } from "../admin/adminUser.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user$: Observable<IAdminUser>;
    
    constructor(
        private _afAuth: AngularFireAuth,
        private _afs: AngularFirestore,
        private _router: Router
    )
    {
        this.user$ = this._afAuth.authState;
    }

    async googleSignin()
    {
        const provider = new firebase.auth.GoogleAuthProvider();
        const credentials = await this._afAuth.signInWithPopup(provider);
    }

    async signOut()
    {
        await this._afAuth.signOut();
        this._router.navigate(["/"]);
    }

}
