import { Component, ChangeDetectionStrategy, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core'

import { MatSort } from '@angular/material/sort'
import { MatPaginator } from '@angular/material/paginator'
import { DataSource } from '@angular/cdk/table'

import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { ReplaySubject } from 'rxjs/ReplaySubject'
import { Subscription } from 'rxjs/Subscription'

import { Customer } from './../../../common/models/customer'

import { DataService } from './../../../common/services/data.service'
import { MediaQueryService } from './../../../common/services/media-query.service'
import { UiFeedbackService } from './../../../common/services/ui-feedback.service'

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerListComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) private _sort: MatSort
  @ViewChild(MatPaginator) private _paginator: MatPaginator
  @ViewChild('filterRef', { read: ElementRef })
  filter: ElementRef
  @ViewChild('filterResetRef', { read: ElementRef })
  filterReset: ElementRef

  customers$: Observable<Customer[]>
  isMobile$: ReplaySubject<boolean>

  share$: Observable<any>
  shareDataSource: any
  dataSource: any
  fields: string[] = ['name', 'company', 'tel', 'email', 'details']
  filterableFields = Array.from(filterable)

  subscriptions: Subscription[] = []

  constructor(
    private _dataService: DataService,
    private _mediaQueryService: MediaQueryService,
    private _feedbackService: UiFeedbackService,
  ) { }

  ngOnInit() {
    this.isMobile$ = this._mediaQueryService.isMobile$
    this.customers$ = this._dataService.customers$
    this.dataSource = new CustomersDataSource(this._dataService.customers$, this._sort, this._paginator)
    this.shareDataSource = new CustomerShareDataSource(this._dataService.share$)
    this.share$ = this._dataService.share$.startWith([])

    const filterValueSub = Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        this.dataSource.filter$$.next(this.filter.nativeElement.value)
      })

    const filterResetSub = Observable.fromEvent(this.filterReset.nativeElement, 'click')
      .subscribe(() => {
        this.filter.nativeElement.value = ''
        this.dataSource.filter$$.next('')
      })

    this.subscriptions.push(filterValueSub, filterResetSub)
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  handleFilterTypeChange(event: any) {
    this.dataSource.filteredField$$.next(event.value)
    this.filter.nativeElement.value = ''
    this.dataSource.filter$$.next('')
  }

  transferCustomer(customerKey: string) {
    this._dataService
      .transferCustomerFromSharedSpace(customerKey)
      .then((response: any | null | undefined) => this._feedbackService.success$$.next())
      .catch((error: Error | any) => this._feedbackService.error$$.next(error))
  }
}

class CustomersDataSource extends DataSource<any> {
  filter$$ = new BehaviorSubject('')
  filteredField$$ = new BehaviorSubject('')
  length$$ = new BehaviorSubject(0) // for pagination
  subscriptions: Subscription[] = []

  constructor(
    private customers$: Observable<Customer[]>,
    private _sort: MatSort,
    private _paginator: MatPaginator
  ) {
    super()
  }

  connect() {
    const displayDataChanges = [
      this._sort.sortChange,
      this._paginator.page,
      this.length$$,
      this.filter$$,
      this.filteredField$$
    ]
    const filterChanges = [this.filter$$, this.filteredField$$]

    this.subscriptions.push(
      Observable.merge(...filterChanges).subscribe(() => {
        this._paginator.pageIndex = 0
      })
    )

    return Observable.merge(...displayDataChanges)
      .throttleTime(200)
      .switchMap(() => this.getSortedData())
  }

  disconnect() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  getSortedData(): Observable<any[]> {
    return this.customers$.map(items => {
      if (!this._sort.active) {
        const x = items.filter(this._filterFn)
        this.length$$.next(x.length)
        return this._pageFn(x)
      }
      const x = items.sort(this._sortFn).filter(this._filterFn)
      this.length$$.next(x.length)
      return this._pageFn(x)
    })
  }

  private _sortFn = (a, b) => {
    let propertyA: number | string = ''
    let propertyB: number | string = ''

    switch (this._sort.active) {
      case 'name':
        [propertyA, propertyB] = [
          a.lastName + a.firstName,
          b.lastName + b.firstName
        ]
        break
    }

    const valueA = isNaN(+propertyA) ? propertyA : +propertyA
    const valueB = isNaN(+propertyB) ? propertyB : +propertyB

    return (
      (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
    )
  }

  private _filterFn = x => {
    const searchStr: string =
      this.filteredField$$.value === 'name'
        ? (x['lastName'] + x['firstName']).toLowerCase()
        : (x[this.filteredField$$.value] || '').toString().toLowerCase()
    return searchStr.includes(this.filter$$.value.toLowerCase())
  }

  private _pageFn = x => {
    const startIndex = this._paginator.pageIndex * this._paginator.pageSize
    const endIndex = startIndex + this._paginator.pageSize
    return x.slice(startIndex, endIndex)
  }
}

const filterable = new Map()
filterable.set('name', 'Nom')
filterable.set('email', 'Email')
filterable.set('tel', 'Téléphone')
filterable.set('company', 'Entreprise')


class CustomerShareDataSource extends DataSource<any> {
  constructor(
    private share$: Observable<Customer[]>,
  ) { super() }
  connect() { return this.share$ }
  disconnect() { }
}
