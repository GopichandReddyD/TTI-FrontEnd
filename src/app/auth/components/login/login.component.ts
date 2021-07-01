import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SharedService } from 'src/app/_shared/services/shared.service';
import { AuthService } from '../../_shared/auth.service';
import { HOME_PAGE_SECTIONS, TOKEN, UUID } from '../../../_shared/constants/constants'
import { EncryptionService } from '../../_shared/encryption.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hidePassowrd: boolean = true;
  isFormSubmitted: boolean = false;
  loginForm: FormGroup = new FormGroup({
    mailId: new FormControl('', Validators.email),
    password: new FormControl('', Validators.minLength(6)),
  });

  constructor(private authService: AuthService,
    private sharedService: SharedService,
    private router: Router,
    private encryptionService: EncryptionService) { }

  ngOnInit(): void {
  }

  loginUser() {
    if (this.loginForm.valid) {
      this.isFormSubmitted = true;
      const reqPayload = {
        mailId: this.loginForm.value.mailId,
        password: this.encryptionService.set(this.loginForm.value.password)
      };
      this.authService.loginUser(reqPayload)
        .subscribe(response => {
          localStorage.setItem(TOKEN, response.token);
          localStorage.setItem(UUID, response.user.uuid);
          this.sharedService.setUserDetails(response.user);
          this.sharedService.setUserLoggedIn(true);
          if (response.user.firstLogin) {
            // TODO: Navigate to set password page
            console.log('first time login');
          } else {
            this.sharedService.isNavigatedFromLogin = true;
            this.router.navigate(['/home']);
            this.sharedService.updateHeaderClick(HOME_PAGE_SECTIONS.DEFAULT);
          }
        });
    }
  }

}
