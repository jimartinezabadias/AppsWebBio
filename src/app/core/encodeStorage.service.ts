import { Injectable } from '@angular/core';
import { getDownloadURL, ref, Storage, StorageReference } from '@angular/fire/storage';
import { uploadBytes, UploadResult } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class EncodeStorageService {

    constructor( private _storage: Storage ) 
    { }

    public getCloudStorageFileRef(filePath: string): StorageReference {
        return ref(this._storage, filePath);
    }

    public getDownloadURL(fileRef: StorageReference): Promise<string>{
        return getDownloadURL(fileRef);
    }

    public uploadFileToCloudStorage(fileRef: StorageReference, rawData: Blob): Promise<UploadResult> {
        return uploadBytes(fileRef, rawData);
    }

}
