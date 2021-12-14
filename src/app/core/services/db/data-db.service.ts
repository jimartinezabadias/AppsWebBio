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
import { IEncodeSettings } from 'src/app/encode/models/IEncodeSettings';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { IEncodeAudio } from 'src/app/encode/models/IEncodeAudio';
import { IEncodeGoogleFormResponse } from 'src/app/encode/models/IEncodeGoogleFormResponse';
import { filter, map } from 'rxjs/operators';


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

  constructor(private _afs: AngularFirestore, private _storage: AngularFireStorage, private http: HttpClient) { 
    this.creativesCollectionRef = _afs.collection<CreativeUser>('creatives-users', ref => ref.orderBy('dateStart', 'desc'));
    this.creativesMetadataRef = _afs.collection('creatives-meta');
    this.rulitUserCollectionRef = _afs.collection<IRulitUser>('rulit-users');
    this.encodeUserCollectionRef = _afs.collection<IEncodeUser>('encode-users');
    this.rulitConfigRef = _afs.collection("rulit-config");
    this.rulitSolutionsRef = _afs.collection("rulit-solutions");
    this.encodeConfigRef = _afs.collection("encode-config");
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
  
  public async saveEncodeDayOneResults(user: IEncodeUser): Promise<void> {
    console.log("saving user data...");
    console.log(user);

    const userObj = Object.assign({},user);
    
    await this.encodeUserCollectionRef.doc<IEncodeUser>(user.uid).set(userObj);
  }

  public async saveEncodeUser(user: IEncodeUser): Promise<void> {
    user.creationDate = firestore.FieldValue.serverTimestamp();
    const dayOneObj = Object.assign({},user.dayOne);
    const userObj = Object.assign({},user);
    userObj.dayOne = dayOneObj;
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

  async getEncodeSettings(): Promise<IEncodeSettings> {
    let cfg = await this.encodeConfigRef.doc<IEncodeSettings>("config").get().toPromise();
    return cfg.data();
  }

  public setCloudStorageFileRef(filePath: string): AngularFireStorageReference{
    return this._storage.ref(filePath);
  }
  
  public uploadFileToCloudStorage(filePath: string, rawData: Blob): AngularFireUploadTask {
    return this._storage.upload(filePath,rawData);
  }

}

