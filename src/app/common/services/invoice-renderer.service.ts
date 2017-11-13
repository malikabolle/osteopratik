import { Person } from './../models/person'
import { Profile } from './../models/profile'
import { Settings } from './../models/settings'
import { Customer } from './../models/customer'
import { Address } from './../models/address'
import { Injectable } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { Observable } from 'rxjs/Rx'
import * as marked from 'marked'

import { DataService } from './data.service'
import { Invoice, InvoiceTemplate } from './../models/invoice'


const viewVariables = (template, logo) => ({
  logo: `<img src="${logo}" alt="invoice_logo">`,
  start: `<div class="flex-container">`,
  end: `</div>`,
  fill: `<div class="fill"></div>`,
  space: `<div class="space"></div>`,
})

const defaultTemplate = `
{start}
# Facture
{fill}
{logo}
{end}
***
{space}
`

@Injectable()
export class InvoiceRendererService {

  invoiceTemplate$: Observable<InvoiceTemplate | any>
  invoiceLogo$: Observable<string | any>
  invoice$: Observable<Invoice>
  html$: Observable<SafeHtml>

  constructor(
    private _domSanitizer: DomSanitizer,
    private _dataService: DataService,
  ) {
    this.invoice$ = this._dataService.invoice$
    this.invoiceTemplate$ = this._dataService.invoiceTemplate$
    this.invoiceLogo$ = this._dataService.invoiceLogo$
    this.html$ = this.invoiceTemplate$
      .switchMap((template: InvoiceTemplate | any) => this.invoiceLogo$
        .map((logo: any) => this.render(template, logo)))
  }

  // interpolate {variableName} to it's value
  interpolate(template: string, variables: any) {
    const matches = template.match(/\{.*?\}/gm) || []

    matches.forEach(match => {
      const varName = match.replace(/[{} ]/gm, '')
      if (varName in variables) {
        template = template.replace(match, variables[varName].toString())
      } else {
        template = template.replace(match, `[La proriété ${varName} est inexistante]`)
      }
    })
    return template
  }

  render(template: InvoiceTemplate, logo: string) {
    if (!template) { template = defaultTemplate }
    const hybrid = marked(template)
    const html = this.interpolate(hybrid, viewVariables(hybrid, logo))
    const safeHtml = this._domSanitizer.bypassSecurityTrustHtml(html)
    return safeHtml
  }

}
