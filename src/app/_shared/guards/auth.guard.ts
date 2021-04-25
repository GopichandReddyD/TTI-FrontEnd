import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '../services/shared.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private router: Router,
    private sharedService: SharedService) { }

  private checkUserAccessRoles(route: Route | ActivatedRouteSnapshot) {
    if (!this.sharedService.userDetails) {
      this.router.navigate(['/home']);
      return false;
    }
    const canAccess = this.sharedService.hasAccessRole(route.data.roles);
    if (!canAccess) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkUserAccessRoles(route);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkUserAccessRoles(route);
  }
}
