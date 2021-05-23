import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'orientation-dialog',
    templateUrl: 'orientation-dialog.html',
})
export class ScreenOrientationDialogComponent {

constructor(
    public dialogRef: MatDialogRef<ScreenOrientationDialogComponent>) {}
}