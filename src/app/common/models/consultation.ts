import { Invoice } from './invoice'

export type ConsultationProgrammed = 'programmed'
export type ConsultationDone = 'done'
export type ConsultationCanceled = 'canceled'
export type ConsultationTransferred = 'transferred'
export const consultationProgrammed: ConsultationProgrammed = 'programmed'
export const consultationDone: ConsultationDone = 'done'
export const consultationCanceled: ConsultationCanceled = 'canceled'
export const consultationTransferred: ConsultationTransferred = 'transferred'

export const consultationStatus = {
  consultationProgrammed,
  consultationDone,
  consultationCanceled,
  consultationTransferred,
}

export type ConsultationStatus =
  | ConsultationProgrammed
  | ConsultationDone
  | ConsultationCanceled
  | ConsultationTransferred

export class Consultation {
  constructor(
    public date: Date,
    public time: string,
    public reason: string,
    public status: ConsultationStatus,
    public report?: string,
    public remarks?: string,
    public pictures?: string[],
    public invoice?: Invoice,
    public $key?: string,
    public $value?: string,
    public $exists?: () => boolean,
  ) { }
}
