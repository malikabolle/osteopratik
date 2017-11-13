import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AgendaComponent } from './agenda.component'

const routes: Routes = [
  { path: '', pathMatch: 'full', component: AgendaComponent },
  { path: '**', redirectTo: '' },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendaRoutingModule { }
