import { InvoiceRendererService } from './../../common/services/invoice-renderer.service'
import { InvoiceTemplate } from './../../common/models/invoice'
import { Address } from './../../common/models/address'
import { Observable } from 'rxjs/Rx'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core'
import * as marked from 'marked'

@Component({
  selector: 'app-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.scss'],
})
export class MarkdownEditorComponent implements OnInit {

  html: SafeHtml
  @Output() htmlChange = new EventEmitter()

  @ViewChild('textArea') textArea: ElementRef

  // map {var} to an html element as str
  viewVariables: any = {}
  @Input() template: string
  @Input() logo: string

  constructor(
    private _domSanitizer: DomSanitizer,
    private _invoiceRendererService: InvoiceRendererService
  ) { }

  header(level: number) {
    const symbol = `${'#'.repeat(level)}`
    const transform = (value: string) => {
      const cleaned = value.replace(/#*\ */g, '')
      return `${symbol} ${cleaned}  `
    }
    this.setValue(transform)
  }
  rule() {
    const transform = (value: string) => `${value}  \n***  \n`
    this.setValue(transform)
  }
  updateLogo(base64: string) {
    this.logo = base64
    this._render(this.template, this.logo)
  }

  setValue(transform: (value: string) => string) {
    const element = this.textArea.nativeElement as HTMLTextAreaElement
    let before = this.template.substring(0, element.selectionStart)
    const after = this.template.substring(element.selectionEnd, this.template.length)
    let transformed

    // if something is selected, then transform selection otherwise transform the whole line
    if (element.selectionStart === element.selectionEnd) {
      const lines = before.split('\n')
      const lastLine = lines[lines.length - 1]
      const closestLineBreak = before.lastIndexOf('\n')
      const selection = this.template.substring(closestLineBreak + 1, element.selectionEnd)
      before = this.template.substring(0, closestLineBreak + 1)
      transformed = transform(selection)
    } else {
      const selection = this.template.substring(element.selectionStart, element.selectionEnd)
      transformed = transform(selection)
    }
    this.template = `${before}${transformed}${after}`
    this._render(this.template, this.logo)
  }

  ngOnInit() {
    Observable
      .fromEvent(this.textArea.nativeElement, 'keyup')
      .startWith(true) // dangerous bet, 500 ms => view Init ?
      .debounceTime(500)
      .subscribe(() => this._render(this.template, this.logo))

  }

  private _render(template: InvoiceTemplate, logo: string) {
    const safeHtml = this._invoiceRendererService.render(template, logo)
    this.htmlChange.emit(safeHtml)
  }
}
