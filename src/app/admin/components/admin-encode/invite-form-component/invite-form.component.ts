import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-invite-form',
  templateUrl: './invite-form.component.html',
  styleUrls: ['invite.scss','../../admin.component.scss'],
})
export class InviteFormComponent {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  
  nameFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(public dialogRef: MatDialogRef<InviteFormComponent>) {}

  onClose(result: boolean): void {
    this.dialogRef.close(result);
  }

}
