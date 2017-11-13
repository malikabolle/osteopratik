import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { SignInComponent } from './sign-in.component'

const routes: Routes = [
  { path: '', pathMatch: 'full', component: SignInComponent },
  { path: '**', redirectTo: '' },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignInRoutingModule { }
