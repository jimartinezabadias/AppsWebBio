import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { CreativeUser } from "./creative-user.interface";
import { CreativityFirestoreService } from "../creativityFirestore.service";
import { DocumentData, DocumentSnapshot, QuerySnapshot } from "@angular/fire/firestore";

export class CreativityTestsDataSource implements DataSource<CreativeUser> {

    private _testsSubject = new BehaviorSubject<CreativeUser[]>([]);
    private _loadingSubject = new BehaviorSubject<boolean>(false);
    private _actualPageFirstDoc: DocumentSnapshot<DocumentData> = null;
    private _actualPageLastDoc: DocumentSnapshot<DocumentData> = null;
    private _prevFirstQueue: Array<DocumentSnapshot<DocumentData>> = [];

    public loading$ = this._loadingSubject.asObservable();

    constructor(private _creativityFirestoreService: CreativityFirestoreService) {}

    connect(collectionViewer: CollectionViewer): Observable<CreativeUser[] | readonly CreativeUser[]> {
        return this._testsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this._testsSubject.complete();
        this._loadingSubject.complete();
    }
  
    async loadTests(pageSize: number) {
        
        this._loadingSubject.next(true);
        
        const usersSnapshot = await this._creativityFirestoreService.getFirstPage(pageSize);
        this._loadNewResults(usersSnapshot);
        this._loadingSubject.next(false);
    }

    async loadNextTestsPage(pageSize: number) {
        
        this._loadingSubject.next(true);

        this._prevFirstQueue.push(this._actualPageFirstDoc);
        const usersSnapshot = await this._creativityFirestoreService.getNextPage(this._actualPageLastDoc, pageSize);
        this._loadNewResults(usersSnapshot);
        this._loadingSubject.next(false);
    }
    
    public async loadPrevTestsPage(pageSize: number){
        
        this._loadingSubject.next(true);

        let prevFirst = this._prevFirstQueue.pop();

        const usersSnapshot = await this._creativityFirestoreService.getPrevPage(prevFirst, this._actualPageFirstDoc, pageSize);
        this._loadNewResults(usersSnapshot);
        this._loadingSubject.next(false);
    }

    private _loadNewResults(results: QuerySnapshot<CreativeUser>): void
    {
        if (results.size > 0) {
            let arrUsers: CreativeUser[] = [];
            this._testsSubject.next(arrUsers);
                
            results.docs.forEach( doc => {
                arrUsers.push(doc.data() as CreativeUser);
            });
    
            this._actualPageFirstDoc = results.docs[0];
            this._actualPageLastDoc = results.docs[results.size - 1];
            
            this._testsSubject.next(arrUsers);
        }
    }
}
