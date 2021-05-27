import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
    userName: string,
    message: string;
}

@Component({
    selector: 'long-memory-wellcome-dialog',
    templateUrl: 'long-memory-wellcome-dialog.html',
})
export class LongMemoryWellcomeDialogComponent {

constructor(
    public dialogRef: MatDialogRef<LongMemoryWellcomeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}