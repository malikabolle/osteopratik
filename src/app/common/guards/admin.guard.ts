import { Injectable } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'

import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'

import { DataService } from './../services/data.service'

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    private _angularFireAuth: AngularFireAuth,
    private _dataService: DataService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this._dataService.access$.map(({ admin }) => admin)

  }
}
