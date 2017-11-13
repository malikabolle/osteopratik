import { InvoiceTemplate } from './invoice'
import { Currency } from './currency'

export class Settings {
  constructor(
    public vat: number,
    public invoiceNumber: number,
    public currency: Currency,
    public iban: string,
    public invoiceTemplate: InvoiceTemplate,
    public swift?: string,
    public siret?: string,
    public $key?: string,
    public $value?: string,
    public $exists?: () => boolean,
  ) { }
}
