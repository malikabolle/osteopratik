import { UnhashPipe } from './unhash.pipe'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [UnhashPipe],
  exports: [UnhashPipe],
})
export class UnhashModule { }
