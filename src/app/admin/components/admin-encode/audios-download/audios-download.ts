import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IEncodeAudio } from 'src/app/encode/models/IEncodeAudio';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import {HttpClient} from '@angular/common/http';
import {saveAs} from 'file-saver/dist/FileSaver';
import * as JSZip from 'jszip';
import { ByPassSecurityPipe } from 'src/app/encode/google-forms-component/by-pass-security.pipe';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-admin-audios-download',
    templateUrl: './audios-download.component.html',
    styleUrls: ['./audios-download.component.scss','../../admin.component.scss'],
  })
  export class AudiosDownload implements OnInit{

    constructor(private httpClient: HttpClient,
                private route: ActivatedRoute,
                private _dbService: DataDbService,
                private _sanitizer: DomSanitizer) {
    }
    
    async ngOnInit(): Promise<void> 
    {
        let userIdParam = this.route.snapshot.paramMap.get('userId');
        this.downloadZippedFiles((await this._dbService.getEncodeUser(userIdParam)).dayOne.audios, "audios_"+userIdParam);
    }
    
    public downloadZippedFiles(files: Array<IEncodeAudio>, zipName: string): void {
    
        const zipFile: JSZip = new JSZip();
        let count = 0;
    
        files.forEach(file => {
            const bypass = new ByPassSecurityPipe(this._sanitizer);
            const safeUrl = bypass.transform(file.downloadURL);
            this.httpClient.get(file.downloadURL, {responseType: 'blob'}).subscribe(response => {
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