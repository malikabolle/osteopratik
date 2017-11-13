import { InvoiceListComponent } from './invoice-list/invoice-list.component'
import { InvoiceUpdateComponent } from './invoice-update/invoice-update.component'
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

const routes: Routes = [
  {
    path: 'invoices', children: [
      { path: '', component: InvoiceListComponent },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ]
  },
  {
    path: 'invoice', children: [
      { path: 'update', component: InvoiceUpdateComponent },
      { path: '**', redirectTo: 'read', pathMatch: 'full' },
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
