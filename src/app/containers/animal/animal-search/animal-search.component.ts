import { Animal } from './../../../common/models/animal'
import { toArray } from './../../../common/functions/utilities'
import { Subscription } from 'rxjs/Subscription'
import { MatPaginator } from '@angular/material/paginator'
import { BehaviorSubject } from 'rxjs/Rx'
import { MatSort } from '@angular/material/sort'
import { DataSource } from '@angular/cdk/table'
import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import { DataService } from './../../../common/services/data.service'

@Component({
  selector: 'app-animal-search',
  templateUrl: './animal-search.component.html',
  styleUrls: ['./animal-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimalSearchComponent implements OnInit, OnDestroy {
  animals$: Observable<Animal[]>
  subscriptions: Subscription[] = []

  @ViewChild(MatSort) private _sort
  @ViewChild(MatPaginator) private _paginator: MatPaginator
  @ViewChild('filterRef', { read: ElementRef }) filter: ElementRef
  @ViewChild('filterResetRef', { read: ElementRef }) filterReset: ElementRef


  fields: string[] = ['name', 'breed', 'sex', 'birthday', 'details']
  dataSource: AnimalsDataSource
  filterableFields = Array.from(filterable)

  constructor(
    private _dataService: DataService,
  ) { }

  ngOnInit() {
    this.animals$ = this._dataService.customers$
      .switchMap(customers => {
        const _animals = customers
          .reduce((acc, customer) => {
            const { animals } = customer
            const __animals = toArray(animals).map(animal => {
              animal.customerKey = customer.$key
              return animal
            })
            return [...acc, ...__animals]
          }, [])
        return this._dataService.breeds$.switchMap(breeds => Observable.of(_animals
          .map(animal => {
            const breed = breeds.find(({ $key }) => animal.breedKey === $key) || { name: '' }
            animal.breed = breed.name
            return animal
          })))
      })

    this.dataSource = new AnimalsDataSource(this.animals$, this._sort, this._paginator)

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

}


class AnimalsDataSource extends DataSource<any> {
  filter$$ = new BehaviorSubject('')
  filteredField$$ = new BehaviorSubject('')
  length$$ = new BehaviorSubject(0) // for pagination
  subscriptions: Subscription[] = []


  constructor(private source$: Observable<any[]>, private _sort: MatSort, private _paginator: MatPaginator) {
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
    return this.source$.map(items => {
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

  private _sortFn = (x, y) => (x[this._sort.active] < y[this._sort.active] ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)

  private _filterFn = x => {
    if (!this.filter$$.value.toLowerCase()) { return true }
    const searchStr: string = (x[this.filteredField$$.value] || '').toString().toLowerCase()
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
filterable.set('breed', 'Espèce')
