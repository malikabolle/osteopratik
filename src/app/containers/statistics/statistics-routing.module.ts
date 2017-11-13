import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { StatisticsComponent } from './statistics.component'

const routes: Routes = [
  { path: '', pathMatch: 'full', component: StatisticsComponent },
  { path: '**', redirectTo: '' },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule { }
