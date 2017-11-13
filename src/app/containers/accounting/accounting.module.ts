import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'

import { MatSelectModule } from '@angular/material/select'
import { MatButtonModule } from '@angular/material/button'
import { FlexLayoutModule } from '@angular/flex-layout'

import { AccountingComponent } from './accounting.component'
import { AccountingRoutingModule } from './accounting-routing.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AccountingRoutingModule,

    FlexLayoutModule,
    MatButtonModule,
    MatSelectModule,
  ],
  declarations: [AccountingComponent],
  exports: [AccountingComponent],
})
export class AccountingModule { }
