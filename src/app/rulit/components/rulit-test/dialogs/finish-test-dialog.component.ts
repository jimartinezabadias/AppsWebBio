import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
    title: string,
    message: string;
}

@Component({
    selector: 'finish-test-dialog',
    templateUrl: 'finish-test-dialog.html',
})
export class FinishTestDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<FinishTestDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

}