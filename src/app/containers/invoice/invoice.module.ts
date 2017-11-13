import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'

import { FlexLayoutModule } from '@angular/flex-layout'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSortModule } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'
import { CdkTableModule } from '@angular/cdk/table'

import { MarkdownEditorModule } from './../../components/markdown-editor/markdown-editor.module'

import { InvoiceRoutingModule } from './invoice-routing.module'
import { InvoiceUpdateComponent } from './invoice-update/invoice-update.component'
import { InvoiceListComponent } from './invoice-list/invoice-list.component'

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InvoiceRoutingModule,

    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    CdkTableModule,

    MarkdownEditorModule,
  ],
  declarations: [InvoiceUpdateComponent, InvoiceListComponent],
})
export class InvoiceModule { }
