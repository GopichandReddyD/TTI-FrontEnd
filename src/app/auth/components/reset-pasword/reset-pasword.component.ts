import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../_shared/auth.service';

@Component({
  selector: 'app-reset-pasword',
  templateUrl: './reset-pasword.component.html',
  styleUrls: [
    './reset-pasword.component.scss',
    '../login/login.component.scss'
  ]
})
export class ResetPaswordComponent implements OnInit {
  isFormSubmitted: boolean = false;
  resetPasswordForm: FormGroup = new FormGroup({
    password: new FormControl('', Validators.minLength(6)),
    confirmPassword: new FormControl('', Validators.required)
  });
  hidePassowrd: boolean = true;
  hideConfirmPassowrd: boolean = true;
  passwordsMatch: boolean = true;
  uuid: string = '';

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private snackbar: MatSnackBar,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.uuid = this.activatedRoute.snapshot.params['uuid'] || '';
    this.onFormValueChanges();
  }


  onFormValueChanges(): void {
    this.resetPasswordForm.valueChanges.subscribe(formValue => {
      this.passwordsMatch = (formValue.password === formValue.confirmPassword);
    });
  }

  submitForm() {
    if (this.resetPasswordForm.valid && this.passwordsMatch) {
      this.isFormSubmitted = true;
      const reqBody = {
        token: this.uuid,
        passowrd: this.resetPasswordForm.value.password
      }
      this.authService.resetPassword(reqBody)
        .subscribe(response => {
          this.isFormSubmitted = false;
          this.resetPasswordForm.reset();
          this.router.navigate(['/auth/login']);
          this.snackbar.open('Reset Successful. Please login to continue', null, {
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
