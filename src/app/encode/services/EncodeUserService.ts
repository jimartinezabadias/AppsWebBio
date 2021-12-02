import { Injectable } from "@angular/core";
import { DataDbService } from "src/app/core/services/db/data-db.service";
import { IEncodeUser } from "../models/IEncodeUser";
import { HttpClient } from "@angular/common/http";
import { IEncodeSettings } from "../models/IEncodeSettings";
import { IEncodeGoogleFormResponse } from "../models/IEncodeGoogleFormResponse";
import { IEncodeUserPersonalInfo } from "../models/IEncodeUserPersonalInfo";
import { IEncodeUserHealthInfo } from "../models/IEncodeUserHealthInfo";
import { SomnolenceDegrees } from "../constants";
import { Observable } from "rxjs";
import { IEncodeAudio } from "../models/IEncodeAudio";

@Injectable({
    providedIn: 'root'
})
export class EncodeUserService {
    
    private _user: IEncodeUser = null;
    private _user$: Observable<IEncodeUser> = null;
    
    constructor(private _dbService: DataDbService, private _http: HttpClient)
    {
    }    
    
    // creates and stores a new user
    // returns the created user
    public async createNewUser(userData: {name: string, email: string}): Promise<IEncodeUser>
    {
        const newUserId: string = this._dbService.getNewEncodeDocumentRef().id;
        const googleFormsResponses: IEncodeGoogleFormResponse[] = await this._getGoogleFormsPreFilledURLs(userData.email);
        const newUser: IEncodeUser = {
            uid: newUserId, 
            name: userData.name, 
            email: userData.email, 
            googleFormsResponses: googleFormsResponses,
            creationDate: null,
            personalInfo: null,
            dayOne: null,
            dayTwo: null,
<<<<<<< HEAD
            healthInfo: null,
            abandonedByUser: false
            completed: false
=======
            healthInfo: null
>>>>>>> 6dcd433... starDayTwo buttons
        };
        // TODO: armar array con google forms
        
        await this._dbService.saveEncodeUser(newUser);
        return newUser;
    }

    // searchs in db for user with given id and stores it if found. 
    public async loadUser(userId: string): Promise<boolean> 
    {
        let user: IEncodeUser = await this.getUserData(userId);
        if (user)
        {
            this._user = user;
            return true;
        }
        return false;
    }

    // searchs in db for user with given id and returns abandoned state 
    public async loadUserAbandonedState(userId: string): Promise<boolean> 
    {
        let user: IEncodeUser = await this.getUserData(userId);
        if (user.abandonedByUser)
        {
            return true;
        }
        return false;
    }

    public loadUser$(userId: string): boolean 
    {
        let user$: Observable<IEncodeUser> = this._dbService.getEncodeUser$(userId);
        if (user$)
        {
            this._user$ = user$;
            return true;
        }
        return false;
    }

    get user(): IEncodeUser 
    {
        return this._user;
    }

    set user(value: IEncodeUser) {
        this._user = value;
    }

    public user$(): Observable<IEncodeUser> 
    {
        return this._user$;
    }

    public async saveDayOneResults() 
    {
        await this._dbService.saveEncodeDayOneResults(this._user);
    }
    
    private getUserData(userid: string): Promise<IEncodeUser> 
    {
        return this._dbService.getEncodeUser(userid);
    }

    private async _getGoogleFormsPreFilledURLs(userEmail: string): Promise<IEncodeGoogleFormResponse[]> {
        const encodeConfig: IEncodeSettings = await this._dbService.getEncodeSettings();
        const options = {
            params: {
                email: userEmail,
                formsURLs: encodeConfig.googleFormsURLs
            }
        }
        return this._http.get<IEncodeGoogleFormResponse[]>(encodeConfig.generatePreFilledResponsesScriptURL, options).toPromise();
    }
}