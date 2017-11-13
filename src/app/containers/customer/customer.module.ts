import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

import { FlexLayoutModule } from '@angular/flex-layout'
import { MatNativeDateModule } from '@angular/material'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatSortModule } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'
import { CdkTableModule } from '@angular/cdk/table'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator'
import { FrenchPaginatorIntl } from '../../common/config/paginator.intl'

import { AgmCoreModule } from '@agm/core'
import { UnhashModule } from './../../common/pipes/unhash/unhash.module'

import { CustomerRoutingModule } from './customer-routing.module'
import { CustomerUpdateComponent } from './customer-update/customer-update.component'
import { CustomerListComponent } from './customer-list/customer-list.component'
import { CustomerDetailsComponent } from './customer-details/customer-details.component'
import { CustomerAddComponent } from './customer-add/customer-add.component'
import { CustomerSwitchComponent } from './customer-switch/customer-switch.component'

/*
@todo, once MPaginatorIntl in master, add translation to french for paginator labels
*/

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CustomerRoutingModule,
    UnhashModule,

    AgmCoreModule,

    FlexLayoutModule,
    CdkTableModule,

    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  declarations: [
    CustomerAddComponent,
    CustomerDetailsComponent,
    CustomerListComponent,
    CustomerUpdateComponent,
    CustomerSwitchComponent,
  ],
  exports: [
    CustomerAddComponent,
    CustomerDetailsComponent,
    CustomerListComponent,
    CustomerUpdateComponent,
    CustomerSwitchComponent,
  ],
  providers: [
    { provide: MatPaginatorIntl, useFactory: FrenchPaginatorIntl },
  ]
})
export class CustomerModule { }
