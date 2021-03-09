import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedService {
  public headerClick: BehaviorSubject<string> = new BehaviorSubject('');
  public transparentHeader: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }

  public updateHeaderClick(value: string) {
    this.headerClick.next(value);
  }

  public resetHeaderClick() {
    this.headerClick.next(null);
  }

  public updateTransparentHeader(value: boolean) {
    this.transparentHeader.next(value);
  }
}
