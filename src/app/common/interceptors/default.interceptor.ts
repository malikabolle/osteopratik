import { Injectable } from '@angular/core'
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http'

import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'

import * as localForage from 'localforage'

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {

  constructor(private _auth: AngularFireAuth) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return Observable
      .fromPromise(localForage.getItem('token'))
      .switchMap(token => {
        const newRequest = request.clone({ headers: request.headers.set('Authorization', `Bearer ${token}`) })
        return next.handle(newRequest)
      })

  }

}

