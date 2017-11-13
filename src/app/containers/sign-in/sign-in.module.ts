import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'

import { SignInRoutingModule } from './sign-in-routing.module'
import { SignInComponent } from './sign-in.component'

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SignInRoutingModule,

    MatButtonModule,
    MatCardModule,
    MatInputModule,
  ],
  declarations: [SignInComponent],
  exports: [SignInComponent],
})
export class SignInModule { }
