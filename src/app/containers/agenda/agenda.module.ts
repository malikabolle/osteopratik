import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSortModule } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'
import { CdkTableModule } from '@angular/cdk/table'
import { FlexLayoutModule } from '@angular/flex-layout'

import { AgendaRoutingModule } from './agenda-routing.module'
import { AgendaComponent } from './agenda.component'

@NgModule({
  imports: [
    CommonModule,
    AgendaRoutingModule,

    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    CdkTableModule,
    FlexLayoutModule,
  ],
  declarations: [AgendaComponent],
  exports: [AgendaComponent],
})
export class AgendaModule { }
