import { ReactiveFormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RegisterComponent, ConfirmRegisterDialogComponent } from './register.component'
import { RegisterRoutingModule } from './register-routing.module'

import { MatInputModule } from '@angular/material/input'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatSelectModule } from '@angular/material/select'
import { MatButtonModule } from '@angular/material/button'
import { MatStepperModule } from '@angular/material/stepper'
import { MatDialogModule } from '@angular/material/dialog'

import { CdkStepperModule } from '@angular/cdk/stepper'

import { FlexLayoutModule } from '@angular/flex-layout'

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RegisterRoutingModule,

    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
    MatStepperModule,
    MatDialogModule,
    CdkStepperModule,
    FlexLayoutModule
  ],
  declarations: [
    RegisterComponent,
    ConfirmRegisterDialogComponent
  ],
  entryComponents: [
    ConfirmRegisterDialogComponent
  ]
})
export class RegisterModule { }
