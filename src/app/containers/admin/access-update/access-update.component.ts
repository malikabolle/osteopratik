import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core'
import { DataSource } from '@angular/cdk/table'
import { MatSlideToggleChange } from '@angular/material/slide-toggle'
import { MatSort } from '@angular/material/sort'

import { AngularFireAuth } from 'angularfire2/auth'
import { Observable, BehaviorSubject } from 'rxjs/Rx'

import { Profile } from './../../../common/models/profile'

import { DataService } from './../../../common/services/data.service'
import { UiFeedbackService } from './../../../common/services/ui-feedback.service'

@Component({
  selector: 'app-access-update',
  templateUrl: './access-update.component.html',
  styleUrls: ['./access-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessUpdateComponent implements OnInit {
  @ViewChild(MatSort) private _sort: MatSort

  dataSource: any
  fields: string[] = ['firstName', 'lastName', 'email', 'active']

  users$: Observable<any[]>

  constructor(
    private _dataService: DataService,
    private _auth: AngularFireAuth,
    private _feedbackService: UiFeedbackService,
  ) { }

  ngOnInit() {
    // remove self from list to avoid bricking
    this.users$ = this._dataService.uid$
      .switchMap((uid) => this._dataService.profiles$
        .switchMap(profiles => profiles)
        .filter(({ $key }) => $key !== uid)
        .mergeMap((profile) => {
          const { $key } = profile
          const access$ = this._dataService._db.object(`users/${$key}/access/`)
          return access$.map(access => ({ ...access, ...profile, $key }))
        })
        .filter(({ valid }) => !!valid)
        .scan((acc, curr) => [...acc, curr], [])
        .debounceTime(5))

    this.dataSource = new ProfileDataSource(this.users$, this._sort)
  }


  toggleAccount(event: MatSlideToggleChange, profile: Profile | any) {
    const { checked } = event
    const { $key } = profile
    this._dataService
      .toggleAccount($key, checked)
      .then((response: any | null | undefined) => this._feedbackService.success$$.next())
      .catch((error: Error | any) => this._feedbackService.error$$.next(error))

  }

}

class ProfileDataSource extends DataSource<any> {

  constructor(private source$: Observable<any[]>, private _sort: MatSort) {
    super()
  }

  connect() {
    return Observable.merge(
      this._sort.sortChange,
      this.source$,
    ).switchMap(() => this.getSortedData())
  }

  disconnect() { }

  getSortedData(): Observable<any[]> {
    return this.source$.map(items => {
      if (!this._sort.active || this._sort.direction === '') {
        return items
      }
      return items.sort(this._sortFn)
    })
  }
  private _sortFn = (x, y) => {
    return (
      (x[this._sort.active] < y[this._sort.active] ? -1 : 1) *
      (this._sort.direction === 'asc' ? 1 : -1)
    )
  }
}
