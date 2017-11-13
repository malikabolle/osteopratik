import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AccountingComponent } from './accounting.component'

const routes: Routes = [
  { path: '', pathMatch: 'full', component: AccountingComponent },
  { path: '**', redirectTo: '' },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule { }
