import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ // Ezt a sort adja hozzá
  providedIn: 'root'
})

export class ScoutGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (localStorage.getItem('isScout')) {
      // A kulcs létezik a localStorage-ben, engedélyezze a hozzáférést
      return true;
    } else {
      // A kulcs nem létezik, átirányítás a bejelentkező oldalra vagy egy másik oldalra
      this.router.navigate(['/signin']);
      return false;
    }
  }
};
