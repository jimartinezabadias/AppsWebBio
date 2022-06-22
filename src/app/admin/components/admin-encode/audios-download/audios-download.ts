import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IEncodeAudio } from 'src/app/encode/models/IEncodeAudio';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver/dist/FileSaver';
import * as JSZip from 'jszip';
import { EncodeFirestoreService } from 'src/app/core/encodeFirestore.service';

@Component({
    selector: 'app-admin-audios-download',
    templateUrl: './audios-download.component.html',
    styleUrls: ['../../admin.component.scss'],
})
export class AudiosDownload implements OnInit{

    constructor(private _httpClient: HttpClient,
        private _route: ActivatedRoute,
        private _encodeFirestoreService: EncodeFirestoreService) {
    }

    async ngOnInit(): Promise<void> 
    {
        let userIdParam = this._route.snapshot.paramMap.get('userId');
        const userData = (await this._encodeFirestoreService.getUser(userIdParam)).data();
        let userAudios = new Array<IEncodeAudio>();

        if (userData.sessionOne != null && userData.sessionOne.audios != null) {
            userData.sessionOne.audios.map((audio: IEncodeAudio) => {
                userAudios.push(audio);
            })
            if (userData.sessionTwo.audios != null) {
                userData.sessionTwo.audios.map((audio: IEncodeAudio) => {
                    userAudios.push(audio);
                })
            }
        }

        const zipFileName = "audios_" + userIdParam;
        
        this.downloadZippedFiles(userAudios, zipFileName);
    }

    public downloadZippedFiles(files: Array<IEncodeAudio>, zipName: string): void {

        const zipFile: JSZip = new JSZip();
        let count = 0;

        files.forEach( (file: IEncodeAudio) => {
            this._httpClient.get(file.downloadURL, {responseType: 'blob'}).subscribe(response => {
            file.id = file.id + '.webm';
            zipFile.file(file.id, response, {binary: true});
            count++;
            if (count === files.length) {
                zipFile.generateAsync({type: 'blob'}).then(content => {
                saveAs(content, zipName + '.zip');
                });
            }
            });
        });
    }
}
