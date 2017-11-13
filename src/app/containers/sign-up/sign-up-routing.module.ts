import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { SignUpComponent } from './sign-up.component'

const routes: Routes = [
  { path: '', pathMatch: 'full', component: SignUpComponent },
  { path: '**', redirectTo: '' },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignUpRoutingModule { }
