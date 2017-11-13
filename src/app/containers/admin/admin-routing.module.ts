import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AccessUpdateComponent } from './access-update/access-update.component'
import { BackupComponent } from './backup/backup.component'

const routes: Routes = [
  { path: 'access-update', component: AccessUpdateComponent },
  { path: 'backup', component: BackupComponent },
  { path: '**', redirectTo: 'access-update' },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
