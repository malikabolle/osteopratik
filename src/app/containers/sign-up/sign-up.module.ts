import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

import { FlexLayoutModule } from '@angular/flex-layout'

import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'


import { SignUpRoutingModule } from './sign-up-routing.module'
import { SignUpComponent } from './sign-up.component'

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SignUpRoutingModule,

    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
  ],
  declarations: [SignUpComponent],
  exports: [SignUpComponent],
})
export class SignUpModule { }
