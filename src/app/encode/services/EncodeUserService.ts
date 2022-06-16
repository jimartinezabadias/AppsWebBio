import { Injectable } from "@angular/core";
import { IEncodeUser } from "../models/IEncodeUser";
import { HttpClient } from "@angular/common/http";
import { IEncodeGoogleFormsSettings } from "../models/IEncodeGoogleFormsSettings";
import { IEncodeGoogleFormResponse } from "../models/IEncodeGoogleFormResponse";
import { lastValueFrom, Observable } from "rxjs";
import { IEncodeSessionOne } from "../models/IEncodeSessionOne";
import { IEncodeSessionTwo } from "../models/IEncodeSessionTwo";
import { IEncodeUserConsent } from "../models/IEncodeUserConsent";
import { SessionsEnum } from "../constants";
import { EncodeFirestoreService } from "src/app/core/encodeFirestore.service";
import { serverTimestamp, Unsubscribe } from "@angular/fire/firestore";

@Injectable({
    providedIn: 'root'
})
export class EncodeUserService {
    
    private _user: IEncodeUser = null;
    private _googleFormsResponses$: Observable<IEncodeGoogleFormResponse[]> = null;
    private _googleFormsSubscription$: Unsubscribe;
    
    constructor(private _encodeFirestoreService: EncodeFirestoreService, private _http: HttpClient)
    {
    }    
    
    // creates and stores a new user
    // returns the created user
    public async createNewUser(userData: {name: string, email: string}): Promise<IEncodeUser> {
        const newUserRef = this._encodeFirestoreService.getEncodeNewUserDocumentRef();
        const googleFormsResponses: IEncodeGoogleFormResponse[] = await this._getGoogleFormsPreFilledURLs(newUserRef.id);

        const newSessionOne: IEncodeSessionOne = { 
            completed: false, 
            somnolenceDegree: null, 
            audios: null 
        };

        const newSessionTwo: IEncodeSessionTwo = { 
            completed: false, 
            perpetratorCondition: null, 
            somnolenceDegree: null, 
            identificationResponse: null, 
            audios: null, 
            imageSelectionResponse: null,
            imageSortingResponse: null
        };
        
        const userConsent: IEncodeUserConsent = { hasAccepted: false, date: null };

        const newUserData: IEncodeUser = {
            uid: newUserRef.id, 
            name: userData.name, 
            email: userData.email, 
            googleFormsResponses: googleFormsResponses,
            creationDate: serverTimestamp(),
            personalInfo: null,
            sessionOne: newSessionOne,
            sessionTwo: newSessionTwo,
            healthInfo: null,
            abandonedByUser: false,
            consent: userConsent
        };
        
        await this._encodeFirestoreService.createNewEncodeUser(newUserData, newUserRef);
        return newUserData;
    }

    get user(): IEncodeUser 
    {
        return this._user;
    }

    set user(user: IEncodeUser) {
        this._user = user;
    }

    // TODO
    get googleFormsResponses$(): Observable<IEncodeGoogleFormResponse[]> {
        
        if (this._googleFormsResponses$ == null) {
            this._googleFormsResponses$ = this._encodeFirestoreService.getEncodeGoogleFormsResponses$(this._user.uid);
        }

        return this._googleFormsResponses$;
    }

    get session(): SessionsEnum
    {
        if (this._user.sessionOne.completed == true && this._user.sessionTwo.perpetratorCondition) 
        {
            return SessionsEnum.SessionTwo;
        } else 
        {
            return SessionsEnum.SessionOne;
        }
    }

    public async updateUserInDB() {
        if (this._user == null) return ;
        await this._encodeFirestoreService.updateEncodeUser(this._user);
    }

    public abandonTest(): Promise<void> {
        this._user.abandonedByUser = true;
        return this.updateUserInDB();
    }

    public unsubscribeGoogleForms(): void {
        this._googleFormsSubscription$();
    }
    
    private async _getGoogleFormsPreFilledURLs(newUserId: string): Promise<IEncodeGoogleFormResponse[]> {
        const googleFormsSettings: IEncodeGoogleFormsSettings = await this._encodeFirestoreService.getEncodeGoogleFormsSettings();
        const options = {
            params: {
                userId: newUserId,
                formsURLs: googleFormsSettings.googleFormsURLs
            }
        }

        const request$ = this._http.get<IEncodeGoogleFormResponse[]>(googleFormsSettings.generatePreFilledResponsesScriptURL, options);
        return lastValueFrom(request$);
    }
}