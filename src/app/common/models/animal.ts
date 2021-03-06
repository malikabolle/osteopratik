import { Breed } from './breed'
import { Consultation } from './consultation'
export type Sex = 'male' | 'female' | 'undefined'

export class Animal {
  constructor(
    public breedKey: string,
    public name?: string,
    public birthday?: Date,
    public sex?: Sex,
    public background?: string,
    public consultations?: Consultation[],
    public breed?: string,
    public $key?: string,
    public $value?: string,
    public $exists?: () => boolean,
  ) { }
}
