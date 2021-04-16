import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SharedService } from 'src/app/_shared/services/shared.service';
import { HOME_PAGE_SECTIONS } from '../../_shared/constants/constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public isTransparentHeader: boolean;
  public HOMEPAGE_SECTIONS = HOME_PAGE_SECTIONS;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService) { }

  ngOnInit(): void {
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
  }

  public onLinkClick(sectionId: string) {
    this.router.navigate(['/home']);
    this.sharedService.updateHeaderClick(sectionId);
  }

  public navigatetoUrl() {
    this.router.navigate(['/resources/tti-resources-list']);
  }

  public navigatetoUploader() {
    this.router.navigate(['/uploader/upload']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe);
  }

}
