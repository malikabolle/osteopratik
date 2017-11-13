import { Component, ChangeDetectionStrategy, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { DataSource } from '@angular/cdk/table'
import { MatSort } from '@angular/material/sort'

import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subscription } from 'rxjs/Subscription'

import { Consultation, consultationStatus } from './../../../common/models/consultation'
import { Animal } from './../../../common/models/animal'

import { DataService } from './../../../common/services/data.service'

@Component({
  selector: 'app-animal-details',
  templateUrl: './animal-details.component.html',
  styleUrls: ['./animal-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimalDetailsComponent implements OnInit {
  @ViewChild(MatSort) private _sort: MatSort

  animal$: Observable<Animal>
  consultations$: Observable<Consultation[]>

  dataSource: any
  fields: string[] = ['reason', 'date', 'status', 'details']
  filterableFields = Array.from(filterable)
  consultationStatus = consultationStatus

  constructor(
    private _dataService: DataService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this._route.params
      .first()
      .subscribe(({ customerKey, animalKey }) => {
        this._dataService.customerKey$$.next(customerKey)
        this._dataService.animalKey$$.next(animalKey)
      })

    this.animal$ = this._dataService.animal$
    this.consultations$ = this._dataService.consultations$
    this.dataSource = new ConsultationsDataSource(this.consultations$, this._sort)

  }

}

class ConsultationsDataSource extends DataSource<any> {
  filter$$ = new BehaviorSubject('')

  constructor(private source$: Observable<any[]>, private _sort: MatSort) {
    super()
  }

  connect() {
    return Observable.merge(
      this._sort.sortChange,
      this.source$,
      this.filter$$
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
    return (
      (x[this._sort.active] < y[this._sort.active] ? -1 : 1) *
      (this._sort.direction === 'asc' ? 1 : -1)
    )
  }

  private _filterFn = x => {
    if (!this.filter$$.value.toLowerCase()) {
      return true
    }
    const searchStr: string = x['status'].toString().toLowerCase()
    return searchStr === this.filter$$.value.toLowerCase()
  }
}

const filterable = new Map()
filterable.set('status', 'Status')
