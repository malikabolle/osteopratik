import { Currency } from './currency'
export type InvoiceGenerated = 'generated'
export type InvoiceDone = 'done'
export type InvoiceEmitted = 'emitted'
export type InvoicePaid = 'paid'

export const invoiceGenerated: InvoiceGenerated = 'generated'
export const invoiceEmitted: InvoiceEmitted = 'emitted'
export const invoiceDone: InvoiceDone = 'done'
export const invoicePaid: InvoicePaid = 'paid'
export const invoiceStatus = {
  invoiceEmitted,
  invoiceGenerated,
  invoiceDone,
  invoicePaid
}

export type InvoiceStatus = InvoiceEmitted | InvoiceDone | InvoicePaid | InvoiceGenerated
export type InvoiceTemplate = string

export class Invoice {
  constructor(
    public invoiceNumber: number,
    public status: InvoiceStatus,
    public amount: number,
    public fees: number,
    public emissionDate: number,
    public comment: string,
    public discount?: number,
    public siret?: string,
    public currency?: Currency,
    public vat?: number,
    public $key?: string,
    public $value?: string,
    public $exists?: () => boolean,
  ) { }
}

