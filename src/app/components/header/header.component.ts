import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SharedService } from '../../_shared/services/shared.service';
import { HOME_PAGE_SECTIONS, TOKEN, UUID, USER_ROLES } from '../../_shared/constants/constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public isTransparentHeader: boolean;
  public HOMEPAGE_SECTIONS = HOME_PAGE_SECTIONS;
  public userDetails: any;
  public isUserLoggedIn: boolean = false;
  public displayUploader: boolean = false;
  public diplaySettings: boolean = false;
  public mainCategories: any[] = [];

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.checkForLoggedInUser();
    this.subscriptions.push(this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (!event.url.includes('home')) {
          this.sharedService.updateTransparentHeader(false);
          this.isTransparentHeader = false;
        }
        this.subscriptions.push(this.sharedService.transparentHeader
          .subscribe(value => {
            this.isTransparentHeader = value;
          })
        );
      })
    );
    this.subscribeToLogin();
    this.getCategoriesList();
  }

  private getCategoriesList() {
    this.sharedService.getMainCategories()
      .subscribe(response => {
        this.mainCategories = response;
      })
  }

  private resetLoggedInDetails() {
    this.sharedService.resetUserDetails();
    localStorage.clear();
    this.isUserLoggedIn = false;
    this.displayUploader = false;
    this.diplaySettings = false;
  }

  private checkForLoggedInUser() {
    const token = localStorage.getItem(TOKEN);
    const uuid = localStorage.getItem(UUID);
    if (token && uuid) {
      this.sharedService.checkUserAuthentication(token, uuid)
        .subscribe(response => {
          if (response.tokenValid) {
            this.isUserLoggedIn = true;
            this.userDetails = response.user;
            this.sharedService.setUserDetails(this.userDetails);
            this.displayUploader = this.userDetails.permissions === USER_ROLES.ADMIN || this.userDetails.permissions === USER_ROLES.UPLOADER;
            this.diplaySettings = this.userDetails.permissions === USER_ROLES.ADMIN;
          } else {
            this.resetLoggedInDetails();      
          }
        });
    } else {
      this.resetLoggedInDetails();
    }
  }

  private subscribeToLogin() {
    this.subscriptions.push(this.sharedService.userloggedIn
      .subscribe(userDetails => {
        this.checkForLoggedInUser();
      }));
  }

  public onLinkClick(sectionId: string) {
    this.router.navigate(['/home']);
    this.sharedService.updateHeaderClick(sectionId);
  }

  public navigatetoUrl(category: string) {
    this.router.navigate(['/resources/tti-resources-list', category]);
  }

  public navigatetoUploader() {
    this.router.navigate(['/uploader/upload']);
  }

  public logoutUser() {
    localStorage.clear();
    this.sharedService.setUserLoggedIn(false);
    this.onLinkClick(HOME_PAGE_SECTIONS.DEFAULT);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe);
  }

}
