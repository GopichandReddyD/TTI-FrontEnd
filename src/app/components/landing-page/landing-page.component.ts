import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
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
  private startPosition: number;
  private scrollTime: number;
  private prevSection: ElementRef;
  private nextSection: ElementRef;
  public activeSection: ElementRef;
  public activeSectionId: string = 'section-default';
  public HOMEPAGE_SECTIONS = HOME_PAGE_SECTIONS;

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.detectScroll();
  }

  ngAfterViewInit(): void {
    this.scrollTo(this.Home);
    this.detectHeaderClicks()
  }

  private getElementRef(selectionId: string) {
    switch (selectionId) {
      case HOME_PAGE_SECTIONS.DEFAULT:
        this.prevSection = null;
        this.activeSection = this.Home;
        this.nextSection = this.About;
        break;
      case HOME_PAGE_SECTIONS.ABOUT:
        this.prevSection = this.Home;
        this.activeSection = this.About;
        this.nextSection = this.Contributor
        break;
      case HOME_PAGE_SECTIONS.CONTRIBUTOR:
        this.prevSection = this.About;
        this.activeSection = this.Contributor;
        this.nextSection = this.ContactUs
        break;
      case HOME_PAGE_SECTIONS.CONTACTUS:
        this.prevSection = this.Contributor;
        this.activeSection = this.ContactUs;
        this.nextSection = null
        break;
      default: HOME_PAGE_SECTIONS.DEFAULT;
    }
  }

  private detectScroll() {
    this.startPosition = window.scrollY;
    this.scrollTime = new Date().getTime();
    this.scroll$ = fromEvent(window, 'scroll')
      .pipe(debounceTime(100))
      .subscribe(e => {
        const currentPosition = window.scrollY;
        const height = window.innerHeight;
        if (this.startPosition > currentPosition) {
          const offSet = this.startPosition - currentPosition;
          const scrolledPercentage = (offSet / height * 100);
          const currentTime = new Date().getTime();
          const scrollTimeDiff = currentTime - this.scrollTime;
          if (scrolledPercentage >= 2 && scrollTimeDiff > 700) {
            this.getElementRef(this.activeSectionId);
            if (this.prevSection) {
              this.scrollTo(this.prevSection);
            }
          }
        } else {
          const offSet = currentPosition - this.startPosition;
          const scrolledPercentage = (offSet / height * 100);
          const currentTime = new Date().getTime();
          const scrollTimeDiff = currentTime - this.scrollTime;
          if (scrolledPercentage >= 2 && scrollTimeDiff > 700) {
            this.getElementRef(this.activeSectionId);
            if (this.nextSection) {
              this.scrollTo(this.nextSection);
            }
          }
        }
        this.startPosition = currentPosition
        this.scrollTime = new Date().getTime();
      });
  }

  private updateTransparentHeader() {
    if (this.activeSectionId === HOME_PAGE_SECTIONS.DEFAULT) {
      this.sharedService.updateTransparentHeader(true);
    } else {
      this.sharedService.updateTransparentHeader(false);
    }
  }

  public scrollTo(el: ElementRef) {
    this.scrollTime = new Date().getTime();
    this.activeSection = el;
    this.activeSectionId = el.nativeElement.id;
    this.updateTransparentHeader();
    this.activeSection.nativeElement.scrollIntoView({
      behavior: 'smooth'
    });
  }

  private detectHeaderClicks() {
    this.subscriptions.push(this.sharedService.headerClick
      .subscribe(value => {
        if (value) {
          this.getElementRef(value);
          this.scrollTo(this.activeSection);
          this.sharedService.resetHeaderClick();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.scroll$.unsubscribe();
    this.subscriptions.forEach(subscription => subscription.unsubscribe);
  }

}
