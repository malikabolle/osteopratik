import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'

import { FlexLayoutModule } from '@angular/flex-layout'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'

import { MarkdownEditorModule } from './../../components/markdown-editor/markdown-editor.module'

import { SettingsRoutingModule } from './settings-routing.module'
import { AnimalSettingsComponent } from './animal-settings/animal-settings.component'
import { FinancialSettingsComponent } from './financial-settings/financial-settings.component'

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SettingsRoutingModule,
    MarkdownEditorModule,

    FlexLayoutModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
  ],
  declarations: [AnimalSettingsComponent, FinancialSettingsComponent],
  exports: [AnimalSettingsComponent, FinancialSettingsComponent]
})
export class SettingsModule { }
