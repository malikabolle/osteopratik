import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { ConsultationAddComponent } from './consultation-add/consultation-add.component'
import { ConsultationDetailsComponent } from './consultation-details/consultation-details.component'
import { ConsultationUpdateComponent } from './consultation-update/consultation-update.component'

const routes: Routes = [
  {
    path: 'consultations', children: [
      { path: 'add', component: ConsultationAddComponent },
      { path: '**', redirectTo: 'add', pathMatch: 'full' },
    ]
  },
  {
    path: 'consultation/:consultationKey', children: [
      { path: 'read', component: ConsultationDetailsComponent },
      { path: 'update', component: ConsultationUpdateComponent },
      { path: 'invoice-lazy', loadChildren: './../invoice/invoice.module#InvoiceModule' },
      { path: '**', redirectTo: 'read', pathMatch: 'full' },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultationRoutingModule { }
