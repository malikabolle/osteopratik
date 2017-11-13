import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AdminRoutingModule } from './admin-routing.module'
import { AccessUpdateComponent } from './access-update/access-update.component'
import { BackupComponent } from './backup/backup.component'

import { LoadingModule } from './../../components/loading/loading.module'

import { FlexLayoutModule } from '@angular/flex-layout'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSortModule } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'
import { CdkTableModule } from '@angular/cdk/table'
import { MatTooltipModule } from '@angular/material/tooltip'


@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,

    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    CdkTableModule,

    LoadingModule,
  ],
  declarations: [AccessUpdateComponent, BackupComponent],
  exports: [AccessUpdateComponent, BackupComponent],
})
export class AdminModule { }
