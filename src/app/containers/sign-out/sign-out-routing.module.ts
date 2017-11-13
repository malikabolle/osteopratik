import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { SignOutComponent } from './sign-out.component'

const routes: Routes = [
  { path: '', pathMatch: 'full', component: SignOutComponent },
  { path: '**', redirectTo: '' },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignOutRoutingModule { }
