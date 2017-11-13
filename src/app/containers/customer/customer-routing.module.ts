import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { CustomerAddComponent } from './customer-add/customer-add.component'
import { CustomerDetailsComponent } from './customer-details/customer-details.component'
import { CustomerListComponent } from './customer-list/customer-list.component'
import { CustomerUpdateComponent } from './customer-update/customer-update.component'
import { CustomerSwitchComponent } from './customer-switch/customer-switch.component'

const routes: Routes = [
  {
    path: 'customers', children: [
      { path: '', component: CustomerListComponent },
      { path: 'add', component: CustomerAddComponent },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ]
  },
  {
    path: 'customer/:customerKey', children: [
      { path: 'read', component: CustomerDetailsComponent },
      { path: 'update', component: CustomerUpdateComponent },
      { path: 'add', component: CustomerAddComponent },
      { path: 'switch', component: CustomerSwitchComponent },
      { path: 'animal-lazy', loadChildren: './../animal/animal.module#AnimalModule' },
      { path: '**', redirectTo: 'read', pathMatch: 'full' },
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
