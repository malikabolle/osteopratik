import { environment } from './../environments/environment'
import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
  ) {
    const mode = environment.production ? 'PROD' : 'DEV'
    console.log(`Mode                ${mode}
Version             ${environment.version}
Source              https://github.com/thibaultsavary/osteopratik
Owner               Malika Bolle
By                  Thibault Savary
Contact             thibaultsavary@protonmail.ch
Copyright (c) 2017, Osteopratik
`)
  }
}
