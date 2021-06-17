import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../_shared/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: [
    './forgot-password.component.scss',
    '../login/login.component.scss'
  ]
})
export class ForgotPasswordComponent implements OnInit {
  isFormSubmitted: boolean = false;
  forgotPasswordForm: FormGroup = new FormGroup({
    mailId: new FormControl('', [Validators.email, Validators.required])
  });

  constructor(private snackbar: MatSnackBar,
              private authService: AuthService) { }

  ngOnInit(): void {
  }

  submitForm() {
    this.isFormSubmitted = true;
    if (this.forgotPasswordForm.valid) {
      this.authService.forgotPassword(this.forgotPasswordForm.value.mailId)
        .subscribe(response => {
          this.isFormSubmitted = false;
          this.forgotPasswordForm.reset();
          this.snackbar.open('Password Reset link sent to your mail', null, {
            duration: 2000,
          });
        }, (error) => {
          this.isFormSubmitted = false;
          this.snackbar.open('Something went wrong. Please try again', null, {
            duration: 2000,
          });
        })
    }
  }

}
