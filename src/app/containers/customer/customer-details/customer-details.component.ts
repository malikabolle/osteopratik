import { Component, ChangeDetectionStrategy, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { MatSort } from '@angular/material/sort'
import { DataSource } from '@angular/cdk/table'

import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subscription } from 'rxjs/Subscription'

import { Customer } from './../../../common/models/customer'
import { Animal } from './../../../common/models/animal'

import { DataService } from './../../../common/services/data.service'

const filterable = new Map()
filterable.set('name', 'Nom')
filterable.set('sex', 'Sexe')
filterable.set('breed', 'Espèce')

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) private _sort: MatSort
  @ViewChild('filterRef', { read: ElementRef })
  filter: ElementRef
  @ViewChild('filterResetRef', { read: ElementRef })
  filterReset: ElementRef

  customer$: Observable<Customer>
  animals$: Observable<Animal[]>

  dataSource: any
  fields: string[] = ['name', 'sex', 'breed', 'birthday', 'details']
  filterableFields = Array.from(filterable)

  subscriptions: Subscription[] = []

  mapVisible = false

  constructor(
    private _dataService: DataService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this._route.params.first().subscribe(({ customerKey }) => {
      this._dataService.customerKey$$.next(customerKey)
    })

    this.customer$ = this._dataService.customer$
    this.animals$ = this._dataService.animals$
    this.dataSource = new AnimalsDataSource(this.animals$, this._sort)

    const filterValueSub = Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        this.dataSource.filter$$.next(this.filter.nativeElement.value)
      })

    const filterResetSub = Observable.fromEvent(this.filterReset.nativeElement, 'click').subscribe(() => {
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

  trackBy(index, item) {
    return item.$key
  }
}

class AnimalsDataSource extends DataSource<any> {
  filter$$ = new BehaviorSubject('')
  filteredField$$ = new BehaviorSubject('')

  constructor(private source$: Observable<any[]>, private _sort: MatSort) {
    super()
  }

  connect() {
    return Observable.merge(
      this._sort.sortChange,
      this.filter$$,
      this.filteredField$$
    ).switchMap(() => this.getSortedData())
  }

  disconnect() { }

  getSortedData(): Observable<any[]> {
    return this.source$.map(items => {
      if (!this._sort.active || this._sort.direction === '') {
        return items.filter(this._filterFn)
      }
      return items.sort(this._sortFn).filter(this._filterFn)
    })
  }

  private _sortFn = (x, y) => {
    const a = isNaN(+x[this._sort.active])
      ? x[this._sort.active]
      : +x[this._sort.active]
    const b = isNaN(+y[this._sort.active])
      ? y[this._sort.active]
      : +y[this._sort.active]
    return (a < b ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
  }

  private _filterFn = x => {
    const searchStr: string = (x[this.filteredField$$.value] || '')
      .toString()
      .toLowerCase()
    return this.filteredField$$.value === 'sex'
      ? searchStr === this.filter$$.value.toLowerCase()
      : searchStr.includes(this.filter$$.value.toLowerCase())
  }
}
