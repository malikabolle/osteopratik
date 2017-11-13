import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

import { FlexLayoutModule } from '@angular/flex-layout'
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { MatRippleModule, MatButtonModule } from '@angular/material'

import { SidenavListComponent } from './sidenav-list.component'
@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
  ],
  declarations: [SidenavListComponent],
  exports: [SidenavListComponent],
})
export class SidenavListModule { }
