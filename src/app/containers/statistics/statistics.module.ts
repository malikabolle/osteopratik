import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ChartModule } from './../../components/chart/chart.module'
import { LoadingModule } from './../../components/loading/loading.module'

import { StatisticsComponent } from './statistics.component'
import { StatisticsRoutingModule } from './statistics-routing.module'

@NgModule({
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    ChartModule,
    LoadingModule,
  ],
  declarations: [StatisticsComponent],
  exports: [StatisticsComponent],
})
export class StatisticsModule { }
