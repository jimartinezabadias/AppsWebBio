import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentData, DocumentReference, QuerySnapshot } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';

import { CreativeUser } from './../../models/creative-user.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRulitUser } from 'src/app/rulit/bits/RulitUserService';
import { AdminCreativityComponent } from 'src/app/admin/components/admin-creativity/admin-creativity.component';
import { IEncodeUser } from 'src/app/encode/models/IEncodeUser';
import { IRulitSettings, IRulitSolutionSettings } from 'src/app/rulit/bits/IRulitSettings';
import { IEncodeGoogleFormsSettings } from 'src/app/encode/models/IEncodeGoogleFormsSettings';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { IEncodeGoogleFormResponse } from 'src/app/encode/models/IEncodeGoogleFormResponse';
import { map } from 'rxjs/operators';
import { IEncodeSuspect } from 'src/app/encode/models/IEncodeSuspect';
import { IEncodeTasksResources } from 'src/app/encode/models/IEncodeTasksResources';
import { IEncodeScreenshot } from 'src/app/encode/models/IEncodeScreenshot';

@Injectable({
  providedIn: 'root'
})

export class DataDbService {
  
  private creativesCollectionRef: AngularFirestoreCollection<CreativeUser>;
  private creativesMetadataRef: AngularFirestoreCollection;
  private rulitUserCollectionRef: AngularFirestoreCollection;
  private rulitConfigRef: AngularFirestoreCollection;
  private rulitSolutionsRef: AngularFirestoreCollection;
  public creativesUsers = [];
  private encodeUserCollectionRef: AngularFirestoreCollection;
  private encodeConfigRef: AngularFirestoreCollection;
  private encodeScreenshotCollectionRef: AngularFirestoreCollection<IEncodeScreenshot>;
  private encodeSuspectsRef: AngularFirestoreCollection<IEncodeSuspect>;

  constructor(private _afs: AngularFirestore, private _storage: AngularFireStorage, private http: HttpClient) { 
    this.creativesCollectionRef = _afs.collection<CreativeUser>('creatives-users', ref => ref.orderBy('dateStart', 'desc'));
    this.creativesMetadataRef = _afs.collection('creatives-meta');
    this.rulitUserCollectionRef = _afs.collection<IRulitUser>('rulit-users');
    this.encodeUserCollectionRef = _afs.collection<IEncodeUser>('encode-users');
    this.rulitConfigRef = _afs.collection("rulit-config");
    this.rulitSolutionsRef = _afs.collection("rulit-solutions");
    this.encodeConfigRef = _afs.collection("encode-config");
    this.encodeScreenshotCollectionRef = _afs.collection<IEncodeScreenshot>("encode-config/tasksResources/screenshots");
    this.encodeSuspectsRef = _afs.collection<IEncodeSuspect>("encode-config/tasksResources/suspects");
  } 

  // TODO: Theres no need for async
  async saveContact(newCreativeUser: any): Promise<void> {
    this.creativesCollectionRef.add(newCreativeUser);

    // get actual counter
    // let prevCounter = await this.getCreativesMetadataCounter().ref.get();

    // update and increment tests counter
    this.getCreativesMetadataCounter().update( {"count": firestore.FieldValue.increment(1)} );

  }

  public getTestsFirstPage(pageSize: number = 3):  Observable<QuerySnapshot<CreativeUser>> {
    const testsRef = this._afs.collection<CreativeUser>('creatives-users', 
      ref => ref.orderBy('dateStart', 'desc').limit(pageSize));
    
    return testsRef.get();
  }

  public getTestsNextPage(actualLast, pageSize: number = 3):  Observable<QuerySnapshot<CreativeUser>> {
    const testsRef = this._afs.collection<CreativeUser>('creatives-users', 
      ref => ref.orderBy('dateStart', 'desc').startAfter(actualLast).limit(pageSize));
    
    return testsRef.get();
  }
  
  public getTestsPrevPage(prevFirst,actualFirst, pageSize: number = 3):  Observable<QuerySnapshot<CreativeUser>> {
    const testsRef = this._afs.collection<CreativeUser>('creatives-users', 
      ref => ref.orderBy('dateStart', 'desc').startAt(prevFirst).endBefore(actualFirst).limit(pageSize));
    
    return testsRef.get();
  }

  public getCreativesUsersData(admin: AdminCreativityComponent) {
  // Asigna la instantánea para incluir el ID del documento
  this.creativesCollectionRef.snapshotChanges().subscribe((usersSnapshop) => {
    usersSnapshop.forEach((usersData: any) => {
      this.creativesUsers.push(
        usersData.payload.doc.data()       
      );
      });
    admin.downloadFile(this.creativesUsers);
    });
  }

  async getAllRulitUsersData(): Promise<Array<IRulitUser>> {
    const snapshot = await this.rulitUserCollectionRef.ref.orderBy("trainingDate", "desc").get();
    let users = [];
    snapshot.docs.forEach( (doc: DocumentData) => {
      users.push(doc.data());
    });
    return users;
  }

  public getCreativesMetadataCounter(){
    return this.creativesMetadataRef.doc('tests-counter');
  }

  public getEncodeMetadataCounter(){
    return this.creativesMetadataRef.doc('encode-counter');
  }

  public getNewRulitDocumentRef(): DocumentReference {
    return this.rulitUserCollectionRef.ref.doc();
  }

  public getNewEncodeDocumentRef(): DocumentReference {
    return this.encodeUserCollectionRef.ref.doc();
  }

  async getRulitUserData(userId: string): Promise<IRulitUser> {
    let userData = await this.rulitUserCollectionRef.doc<IRulitUser>(userId).get().toPromise();
    userData.data().userId = userId;
    return userData.data();
  }
  
  async saveRulitUserData(testUser: IRulitUser): Promise<void> {
    
    if ( testUser.nextTest === "long_memory_test" )
      testUser.trainingDate = firestore.FieldValue.serverTimestamp();
    
    if ( testUser.nextTest === "no_next_test" )
      testUser.testDate = firestore.FieldValue.serverTimestamp();

    await this.rulitUserCollectionRef.doc(testUser.userId).set(testUser);
  }

  async getRulitSettings(): Promise<IRulitSettings> {
    let cfg = await this.rulitConfigRef.doc<IRulitSettings>("config").get().toPromise();
    return cfg.data();
  }
  
  async getRulitSolutionSettings(solutionCode: string): Promise<IRulitSolutionSettings> {
    let cfg = await this.rulitSolutionsRef.doc<IRulitSolutionSettings>(solutionCode).get().toPromise();
    return cfg.data();
  }

  // Encode
  
  public async updateEncodeUser(user: IEncodeUser): Promise<void> {
    const userObj = Object.assign({},user);
    await this.encodeUserCollectionRef.doc<IEncodeUser>(user.uid).set(userObj);
  }

  public async createEncodeUser(user: IEncodeUser): Promise<void> {
    user.creationDate = firestore.FieldValue.serverTimestamp();
    const userObj = Object.assign({},user);
    // TODO: change CreativesMetadataCounter to TestsMetadata
    this.getEncodeMetadataCounter().update( {"count": firestore.FieldValue.increment(1)} );
    await this.encodeUserCollectionRef.doc<IEncodeUser>(user.uid).set(userObj);
  }

  public async getEncodeUser(userId: string): Promise<IEncodeUser> {
    let userData = await this.encodeUserCollectionRef.doc<IEncodeUser>(userId).get().toPromise();
    return userData.data();
  }

  // public getEncodeUser$(userId: string): Observable<IEncodeUser> {
  //   return this.encodeUserCollectionRef.doc<IEncodeUser>(userId).valueChanges();
  // }

  public getEncodeUserForms$(userId: string): Observable<IEncodeGoogleFormResponse[]> {
    return this.encodeUserCollectionRef.doc<IEncodeUser>(userId).valueChanges().pipe(map(user => user.googleFormsResponses));
  }

  async getAllEncodeUsersData(): Promise<Array<IEncodeUser>> {
    const snapshot = await this.encodeUserCollectionRef.ref.get();
    let users = new Array<IEncodeUser>();
    snapshot.docs.forEach( (doc: DocumentData) => {
      users.push(doc.data());
    });
    return users;
  }

  public getEncodeFirstPage(pageSize: number = 3):  Observable<QuerySnapshot<IEncodeUser>> {
    const ref = this._afs.collection<IEncodeUser>('encode-users', 
      ref => ref.orderBy('creationDate', 'desc').limit(pageSize));
    
    return ref.get();
  }

  public getEncodesNextPage(actualLast, pageSize: number = 3):  Observable<QuerySnapshot<IEncodeUser>> {
    const ref = this._afs.collection<IEncodeUser>('encode-users', 
      ref => ref.orderBy('creationDate', 'desc').startAfter(actualLast).limit(pageSize));
    
    return ref.get();
  }

  public getEncodePrevPage(prevFirst,actualFirst, pageSize: number = 3):  Observable<QuerySnapshot<IEncodeUser>> {
    const ref = this._afs.collection<IEncodeUser>('encode-users', 
      ref => ref.orderBy('creationDate', 'desc').startAt(prevFirst).endBefore(actualFirst).limit(pageSize));
    
    return ref.get();
  }

  async getEncodeGoogleFormsSettings(): Promise<IEncodeGoogleFormsSettings> {
    let cfg = await this.encodeConfigRef.doc<IEncodeGoogleFormsSettings>("googleFormsSettings").get().toPromise();
    return cfg.data();
  }

  async getEncodeTasksResources(): Promise<IEncodeTasksResources> {
    let resources = await this.encodeConfigRef.doc<IEncodeTasksResources>("tasksResources").get().toPromise();
    return resources.data();
  }

  async getEncodeScreenshot(screenshotId: string): Promise<IEncodeScreenshot> {
    let screenshotDocument = await this.encodeScreenshotCollectionRef.doc<IEncodeScreenshot>(screenshotId).get().toPromise();
    return screenshotDocument.data();
  }

  async getEncodeSuspects(): Promise<Array<IEncodeSuspect>> {
    const snapshot = await this.encodeSuspectsRef.ref.get();
    let suspects = new Array<IEncodeSuspect>();
    snapshot.docs.forEach( (doc: DocumentData) => {
      suspects.push(doc.data());
    });
    return suspects;
  }

  async getEncodeSuspect(suspectId: string): Promise<IEncodeSuspect> {
    let suspectDocument = await this.encodeSuspectsRef.doc<IEncodeSuspect>(suspectId).get().toPromise();
    return suspectDocument.data();
  }
  
  public getCloudStorageFileRef(filePath: string): AngularFireStorageReference {
    return this._storage.ref(filePath);
  }
  
  public uploadFileToCloudStorage(filePath: string, rawData: Blob): AngularFireUploadTask {
    return this._storage.upload(filePath,rawData);
  }

}

