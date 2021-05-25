import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'not-connected-node-dialog',
    templateUrl: 'not-connected-node-dialog.html',
})
export class NotConnectedNodeDialogComponent {

constructor(
    public dialogRef: MatDialogRef<NotConnectedNodeDialogComponent>) {}

    close() {
        this.dialogRef.close();
    }
}
