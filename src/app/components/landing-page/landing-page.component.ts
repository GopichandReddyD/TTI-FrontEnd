import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { SharedService } from 'src/app/_shared/services/shared.service';
import { HOME_PAGE_SECTIONS } from '../../_shared/constants/constants';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('default') Home: ElementRef;
  @ViewChild('about') About: ElementRef;
  @ViewChild('contributor') Contributor: ElementRef;
  @ViewChild('contactus') ContactUs: ElementRef;
  private subscriptions: Subscription[] = [];
  private scroll$: Subscription;
  public activeSection: ElementRef;
  public activeSectionId: string = 'section-default';
  public HOMEPAGE_SECTIONS = HOME_PAGE_SECTIONS;

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.detectElementOnScroll();
  }

  ngAfterViewInit(): void {
    this.scrollTo(this.Home);
    this.detectHeaderClicks();
  }

  private isScrolledIntoView(element: ElementRef) {
    const threshold = 300;
    const rect = element.nativeElement.getBoundingClientRect();
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    const above = (rect.bottom - threshold) < 0;
    const below = (rect.top - viewHeight + threshold) >= 0;
    return (!above && !below);
  }

  private getViewPortElelment() {
    switch (true) {
      case this.isScrolledIntoView(this.Home):
        if (this.activeSectionId !== HOME_PAGE_SECTIONS.DEFAULT) {
          this.scrollTo(this.Home);
        }
        // this.scrollTo(this.Home);
        break;
      case this.isScrolledIntoView(this.About):
        if (this.activeSectionId !== HOME_PAGE_SECTIONS.ABOUT) {
          this.scrollTo(this.About);
        }
        // this.scrollTo(this.About);
        break;
      case this.isScrolledIntoView(this.Contributor):
        if (this.activeSectionId !== HOME_PAGE_SECTIONS.CONTRIBUTOR) {
          this.scrollTo(this.Contributor);
        }
        // this.scrollTo(this.Contributor);
        break;
      case this.isScrolledIntoView(this.ContactUs):
        if (this.activeSectionId !== HOME_PAGE_SECTIONS.CONTACTUS) {
          this.scrollTo(this.ContactUs);
        }
        // this.scrollTo(this.ContactUs);
        break;
    }
  }

  private detectElementOnScroll() {
    this.scroll$ = fromEvent(window, 'scroll')
      .pipe(debounceTime(200))
      .subscribe(e => {
        this.getViewPortElelment();
      });
  }

  private getElementRef(selectionId: string) {
    switch (selectionId) {
      case HOME_PAGE_SECTIONS.DEFAULT:
        this.activeSection = this.Home;
        break;
      case HOME_PAGE_SECTIONS.ABOUT:
        this.activeSection = this.About;
        break;
      case HOME_PAGE_SECTIONS.CONTRIBUTOR:
        this.activeSection = this.Contributor;
        break;
      case HOME_PAGE_SECTIONS.CONTACTUS:
        this.activeSection = this.ContactUs;
        break;
      default: HOME_PAGE_SECTIONS.DEFAULT;
    }
  }

  private updateTransparentHeader() {
    if (this.activeSectionId === HOME_PAGE_SECTIONS.DEFAULT) {
      this.sharedService.updateTransparentHeader(true);
    } else {
      this.sharedService.updateTransparentHeader(false);
    }
  }

  public scrollTo(el: ElementRef) {
    this.activeSection = el;
    this.activeSectionId = el.nativeElement.id;
    this.updateTransparentHeader();
    this.activeSection.nativeElement.scrollIntoView({
      behavior: 'smooth'
    });
  }

  private detectHeaderClicks() {
    this.subscriptions.push(this.sharedService.headerClick
      .pipe(filter(value => !!value))
      .subscribe(value => {
        if (value) {
          this.getElementRef(value);
          this.scrollTo(this.activeSection);
          setTimeout(() => {
            this.sharedService.resetHeaderClick();
          }, 1000);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.scroll$.unsubscribe();
    this.subscriptions.forEach(subscription => subscription.unsubscribe);
  }

}
