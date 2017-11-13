import { LoadingComponent } from './loading.component'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  declarations: [LoadingComponent],
  exports: [LoadingComponent],
})
export class LoadingModule { }
