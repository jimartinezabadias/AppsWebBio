import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { DocumentData, QuerySnapshot } from "@angular/fire/compat/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { DataDbService } from "../services/db/data-db.service";
import { CreativeUser } from "./creative-user.interface";
import firebase from "firebase/compat/app";

export class CreativityTestsDataSource implements DataSource<CreativeUser> {

    private testsSubject = new BehaviorSubject<CreativeUser[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    private actualFirstInPage: firebase.firestore.DocumentSnapshot<DocumentData> = null;
    private actualLastInPage: firebase.firestore.DocumentSnapshot<DocumentData> = null;
    private prevFirstQueue: Array<firebase.firestore.DocumentSnapshot<DocumentData>> = [];

    constructor(private dbService: DataDbService) {}

    connect(collectionViewer: CollectionViewer): Observable<CreativeUser[]> {
        return this.testsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.testsSubject.complete();
        this.loadingSubject.complete();
    }
  
    loadTests(pageSize: number) {
        
        this.loadingSubject.next(true);

        this.dbService.getTestsFirstPage(pageSize)
            .pipe( finalize(() => this.loadingSubject.next(false)) )
            .subscribe( tests => this.loadNewResults(tests));

    }

    loadNextTestsPage(pageSize: number){
        
        this.loadingSubject.next(true);

        this.prevFirstQueue.push(this.actualFirstInPage);

        this.dbService.getTestsNextPage(this.actualLastInPage, pageSize)
            .pipe( finalize(() => this.loadingSubject.next(false)) )
            .subscribe( tests => this.loadNewResults(tests));
    }
    
    loadPrevTestsPage(pageSize: number){
        
        this.loadingSubject.next(true);

        let prevFirst = this.prevFirstQueue.pop();

        this.dbService.getTestsPrevPage( prevFirst, this.actualFirstInPage, pageSize)
            .pipe( finalize(() => this.loadingSubject.next(false)) )
            .subscribe( tests => this.loadNewResults(tests));
    }

    private async loadNewResults(results: QuerySnapshot<CreativeUser>): Promise<void>{
        
        let arrUsers: CreativeUser[] = [];
        this.testsSubject.next(arrUsers);
            
        results.docs.forEach( test => {
            arrUsers.push(test.data());
        });

        this.actualFirstInPage = await results.docs[0].ref.get();
        this.actualLastInPage = await results.docs[results.size - 1].ref.get();
        
        this.testsSubject.next(arrUsers);
        // this.loadingSubject.next(false);
    }

}
