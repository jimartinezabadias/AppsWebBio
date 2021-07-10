import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-invite-form',
  templateUrl: './invite-form.component.html',
  styleUrls: ['invite.scss','../../admin.component.scss'],
})
export class InviteFormComponent {
  
  public emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  
  public nameFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(public dialogRef: MatDialogRef<InviteFormComponent>) {}

  public onClose(): void 
  {
    this.dialogRef.close(null);
  }

  public onSave()
  {
    let name = this.nameFormControl.value;
    let email = this.emailFormControl.value;
    this.dialogRef.close({ name, email });
  }

}
