import { MatSort } from '@angular/material/sort'
import { Subscription } from 'rxjs/Rx'
import { DataSource } from '@angular/cdk/table'
import { Consultation } from './../../../common/models/consultation'
import { Animal } from './../../../common/models/animal'
import { toArray } from './../../../common/functions/utilities'
import { Customer } from './../../../common/models/customer'
import { DataService } from './../../../common/services/data.service'
import { Observable } from 'rxjs/Observable'
import { Invoice, invoiceStatus } from './../../../common/models/invoice'
import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core'

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceListComponent implements OnInit {
  @ViewChild(MatSort) private _sort: MatSort

  fields = ['invoiceNumber', 'emissionDate', 'status', 'details']
  invoices$: Observable<Invoice[]>
  dataSource: InvoicesDataSource
  invoiceStatus = invoiceStatus

  constructor(
    private _dataService: DataService,
  ) { }

  ngOnInit() {
    this.invoices$ = this._dataService.customers$.map((customers: Customer[]) => customers
      .reduce((acc, { animals, $key }) => {
        return [...acc, ...toArray(animals).map(animal => ({ ...animal, customerKey: $key }))]
      }, [])
      .filter((animal: Animal) => !!animal.consultations)
      .reduce((acc, { consultations, $key, customerKey }) => {
        return [...acc, ...toArray(consultations).map(consultation => ({ ...consultation, animalKey: $key, customerKey }))]
      }, [])
      .filter((consultation: Consultation) => !!consultation.invoice)
      .map(({ invoice, $key, customerKey, animalKey }) => ({ ...invoice, consultationKey: $key, customerKey, animalKey }))
      .filter(({ status }) => status !== invoiceStatus.invoicePaid))

    this.dataSource = new InvoicesDataSource(this.invoices$, this._sort)
  }
}


class InvoicesDataSource extends DataSource<any> {

  constructor(
    private invoices$: Observable<Invoice[]>,
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
    return this.invoices$.map(items => items.sort(this._sortFn))
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
