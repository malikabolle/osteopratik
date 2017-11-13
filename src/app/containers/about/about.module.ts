import { FlexLayoutModule } from '@angular/flex-layout'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AboutRoutingModule } from './about-routing.module'
import { AboutComponent } from './about.component'

import { MatIconModule } from '@angular/material/icon'

@NgModule({
  imports: [
    CommonModule,
    AboutRoutingModule,
    MatIconModule,
    FlexLayoutModule,
  ],
  declarations: [AboutComponent]
})
export class AboutModule { }
