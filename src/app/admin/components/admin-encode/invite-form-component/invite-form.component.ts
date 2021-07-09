import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-invite-form',
  templateUrl: './invite-form.component.html',
  styleUrls: ['../../admin.component.scss'],
})
export class InviteFormComponent {

  constructor(public dialogRef: MatDialogRef<InviteFormComponent>) {}

  onClose(result: boolean): void {
    this.dialogRef.close(result);
  }

}
