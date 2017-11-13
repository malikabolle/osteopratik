import { LoadingModule } from './../../components/loading/loading.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { FlexLayoutModule } from '@angular/flex-layout'

import { InvoiceRendererService } from './../../common/services/invoice-renderer.service'
import { PrintComponent } from './print/print.component'
import { PrintAllComponent } from './print-all/print-all.component'

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    LoadingModule,
  ],
  declarations: [PrintComponent, PrintAllComponent],
  exports: [PrintComponent, PrintAllComponent],
  providers: [InvoiceRendererService],
})
export class PrintModule { }
