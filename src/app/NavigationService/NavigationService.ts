import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { DataDbService } from "src/app/core/services/db/data-db.service";
import { IRulitSettings } from "../rulit/bits/IRulitSettings";

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    private _rulitConfig: IRulitSettings;
    private _rulitConfig$ = new Subject<IRulitSettings>();
    private _rulitSolutionCodeUrl: string = null;

    public isRulitOpen: boolean = false;

    constructor(private _dbService: DataDbService)
    {
        this.rulitConfigChanged$.subscribe(
            {
                next: (config) => this.isRulitOpen = config.IS_TEST_OPEN  
            });

        this.loadRulitConfig();
    }

    get rulitConfig(): IRulitSettings 
    {
        return this._rulitConfig;
    }

    get rulitConfigChanged$(): Observable<IRulitSettings> 
    {
        return this._rulitConfig$.asObservable();
    }

    get rulitSolutionCodeUrl(): string 
    {
        return this._rulitSolutionCodeUrl;
    }

    set rulitSolutionCodeUrl(urlCode: string) 
    {
        this._rulitSolutionCodeUrl = urlCode;
    }

    // Load config from db
    async loadRulitConfig(): Promise<void> 
    {
        this._rulitConfig = await this._dbService.getRulitSettings();
        this._rulitConfig$.next(this._rulitConfig);
    }

}
