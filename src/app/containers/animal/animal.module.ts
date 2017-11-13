import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator'
import { FrenchPaginatorIntl } from '../../common/config/paginator.intl'
import { MatSortModule } from '@angular/material/sort'
import { MatSelectModule } from '@angular/material/select'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatNativeDateModule } from '@angular/material/'
import { MatTableModule } from '@angular/material/table'
import { CdkTableModule } from '@angular/cdk/table'
import { FlexLayoutModule } from '@angular/flex-layout'

import { UnhashModule } from './../../common/pipes/unhash/unhash.module'

import { AnimalRoutingModule } from './animal-routing.module'
import { AnimalUpdateComponent } from './animal-update/animal-update.component'
import { AnimalDetailsComponent } from './animal-details/animal-details.component'
import { AnimalAddComponent } from './animal-add/animal-add.component'
import { AnimalSwitchComponent } from './animal-switch/animal-switch.component'
import { AnimalSearchComponent } from './animal-search/animal-search.component'

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AnimalRoutingModule,
    UnhashModule,

    FlexLayoutModule,
    CdkTableModule,

    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatTableModule,
    CdkTableModule,
    MatTooltipModule
  ],
  declarations: [
    AnimalAddComponent,
    AnimalDetailsComponent,
    AnimalUpdateComponent,
    AnimalSwitchComponent,
    AnimalSearchComponent,
  ],
  exports: [
    AnimalAddComponent,
    AnimalDetailsComponent,
    AnimalUpdateComponent,
    AnimalSwitchComponent,
    AnimalSearchComponent,
  ],
  providers: [
    { provide: MatPaginatorIntl, useFactory: FrenchPaginatorIntl },
  ]
})
export class AnimalModule { }
