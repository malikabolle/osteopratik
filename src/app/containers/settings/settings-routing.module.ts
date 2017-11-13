import { AccountActiveGuard } from './../../common/guards/account-active.guard'
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { FinancialSettingsComponent } from './financial-settings/financial-settings.component'
import { AnimalSettingsComponent } from './animal-settings/animal-settings.component'

const routes: Routes = [
  { path: 'animal', component: AnimalSettingsComponent, canActivate: [AccountActiveGuard] },
  { path: 'finance', component: FinancialSettingsComponent },
  { path: '**', redirectTo: 'animal' },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
