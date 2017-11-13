import { AnimalSearchComponent } from './animal-search/animal-search.component'
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AnimalAddComponent } from './animal-add/animal-add.component'
import { AnimalDetailsComponent } from './animal-details/animal-details.component'
import { AnimalUpdateComponent } from './animal-update/animal-update.component'
import { AnimalSwitchComponent } from './animal-switch/animal-switch.component'

const routes: Routes = [
  {
    path: 'animals', children: [
      { path: 'add', component: AnimalAddComponent },
      { path: '**', redirectTo: 'add', pathMatch: 'full' },
    ]
  },
  {
    path: 'animal/:animalKey', children: [
      { path: 'read', component: AnimalDetailsComponent },
      { path: 'update', component: AnimalUpdateComponent },
      { path: 'switch', component: AnimalSwitchComponent },
      { path: 'consultation-lazy', loadChildren: './../consultation/consultation.module#ConsultationModule' },
      { path: '**', redirectTo: 'read', pathMatch: 'full' },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnimalRoutingModule { }
