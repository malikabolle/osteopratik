import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'


import { ImageInputComponent } from './components/image-input/image-input.component'
import { DynamicFieldDirective } from './components/dynamic-field/dynamic-field.directive'
import { DynamicFormComponent } from './containers/dynamic-form/dynamic-form.component'

import { FlexLayoutModule } from '@angular/flex-layout'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatButtonModule } from '@angular/material/button'

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  declarations: [
    DynamicFieldDirective,
    DynamicFormComponent,
    ImageInputComponent,
  ],
  exports: [DynamicFormComponent],
  entryComponents: [ImageInputComponent]
})
export class DynamicFormModule { }
