import { MatSort } from '@angular/material/sort'
import { Animal } from './../../common/models/animal'
import { Customer } from './../../common/models/customer'
import { toArray } from './../../common/functions/utilities'
import { DataService } from './../../common/services/data.service'
import { Consultation, consultationStatus } from './../../common/models/consultation'
import { Observable } from 'rxjs/Rx'
import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core'
import { DataSource } from '@angular/cdk/table'

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgendaComponent implements OnInit {
  @ViewChild(MatSort) _sort: MatSort
  consultationStatus = consultationStatus
  fields = ['date', 'reason', 'status', 'details']
  consultations$: Observable<Consultation[]>
  dataSource: ConsultationsDataSource

  constructor(
    private _dataService: DataService,
  ) { }

  ngOnInit() {
    this.consultations$ = this._dataService.customers$.map((customers: Customer[]) => customers
      .reduce((acc, { animals, $key }) => {
        return [...acc, ...toArray(animals).map(animal => ({ ...animal, customerKey: $key }))]
      }, [])
      .filter((animal: Animal) => !!animal.consultations)
      .reduce((acc, { consultations, $key, customerKey }) => {
        return [...acc, ...toArray(consultations).map(consultation => ({ ...consultation, animalKey: $key, customerKey }))]
      }, [])
      .filter(({ date, time, status }) => {
        const now = +new Date()
        const consultationDate = new Date(date)
        const [hours, minutes] = time.split(':')
        consultationDate.setHours(+hours)
        consultationDate.setHours(+minutes)
        const datePassed = now < +consultationDate
        const openStatus = status === consultationStatus.consultationProgrammed // || status === consultationStatus.consultationCanceled
        return openStatus || datePassed
      }))
    this.consultations$.subscribe(console.log)

    this.dataSource = new ConsultationsDataSource(this.consultations$, this._sort)

  }

}


class ConsultationsDataSource extends DataSource<any> {

  constructor(
    private consultations$: Observable<Consultation[]>,
    private _sort: MatSort,
  ) { super() }

  connect() {
    const displayDataChanges = [
      this._sort.sortChange
    ]
    return Observable
      .merge(...displayDataChanges)
      .startWith(true)
      .throttleTime(200)
      .switchMap(() => this.getSortedData())
  }

  disconnect() { }

  getSortedData(): Observable<any[]> {
    return this.consultations$.map(items => items.sort(this._sortFn))
  }

  private _sortFn = (a, b) => {
    let propertyA: number | string
    let propertyB: number | string
    [propertyA, propertyB] = [a[this._sort.active], b[this._sort.active]]
    const valueA = isNaN(+propertyA) ? propertyA : +propertyA
    const valueB = isNaN(+propertyB) ? propertyB : +propertyB
    const direction = this._sort.direction === 'asc' ? 1 : -1
    return (valueA < valueB ? -1 : 1) * direction
  }

}
