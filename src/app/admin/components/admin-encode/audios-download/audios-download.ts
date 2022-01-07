import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IEncodeAudio } from 'src/app/encode/models/IEncodeAudio';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import {HttpClient} from '@angular/common/http';
import {saveAs} from 'file-saver/dist/FileSaver';
import * as JSZip from 'jszip';

@Component({
    selector: 'app-admin-audios-download',
    templateUrl: './audios-download.component.html',
    styleUrls: ['./audios-download.component.scss','../../admin.component.scss'],
})
export class AudiosDownload implements OnInit{

    constructor(private _httpClient: HttpClient,
                private _route: ActivatedRoute,
                private _dbService: DataDbService) {
    }

    async ngOnInit(): Promise<void> 
    {
        let userIdParam = this._route.snapshot.paramMap.get('userId');
        const userData = await this._dbService.getEncodeUser(userIdParam);
        let userAudios = new Array<IEncodeAudio>();

        if (userData.dayOne != null) {
            userData.dayOne.audios.map((audio: IEncodeAudio) => {
                userAudios.push(audio);
            })
        }

        // TODO: agregar cuando dayTwo tenga audios
        // if (userData.dayTwo != null) {
        //     userData.dayTwo.audios.map((audio: IEncodeAudio) => {
        //         userAudios.push(audio);
        //     })
        // }

        const zipFileName = "audios_" + userIdParam;
        
        this.downloadZippedFiles(userAudios, zipFileName);
    }

    public downloadZippedFiles(files: Array<IEncodeAudio>, zipName: string): void {

        const zipFile: JSZip = new JSZip();
        let count = 0;

        files.forEach(file => {
            this._httpClient.get(file.downloadURL, {responseType: 'blob'}).subscribe(response => {
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