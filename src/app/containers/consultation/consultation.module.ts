import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

import { MatNativeDateModule } from '@angular/material/'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatMenuModule } from '@angular/material/menu'
import { MatSelectModule } from '@angular/material/select'
import { MatTableModule } from '@angular/material/table'
import { CdkTableModule } from '@angular/cdk/table'
import { MatTooltipModule } from '@angular/material/tooltip'
import { FlexLayoutModule } from '@angular/flex-layout'

import { CarouselModule } from './../../components/carousel/carousel.module'
import { DynamicFormModule } from './../../components/dynamic-form/dynamic-form.module'

import { ConsultationRoutingModule } from './consultation-routing.module'
import { ConsultationUpdateComponent } from './consultation-update/consultation-update.component'
import { ConsultationDetailsComponent } from './consultation-details/consultation-details.component'
import { ConsultationAddComponent } from './consultation-add/consultation-add.component'

@NgModule({
  imports: [
    CommonModule,
    ConsultationRoutingModule,
    ReactiveFormsModule,
    FormsModule,

    CarouselModule,
    DynamicFormModule,

    FlexLayoutModule,

    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTableModule,
    CdkTableModule,
    MatTooltipModule,

  ],
  declarations: [
    ConsultationAddComponent,
    ConsultationDetailsComponent,
    ConsultationUpdateComponent
  ],
  exports: [
    ConsultationAddComponent,
    ConsultationDetailsComponent,
    ConsultationUpdateComponent
  ],
  entryComponents: [
  ]
})
export class ConsultationModule { }
