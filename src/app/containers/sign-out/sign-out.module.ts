import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

import { SignOutRoutingModule } from './sign-out-routing.module'
import { SignOutComponent } from './sign-out.component'

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SignOutRoutingModule,
  ],
  declarations: [SignOutComponent],
  exports: [SignOutComponent],
})
export class SignOutModule { }
