import { Breed } from './breed'
import { Consultation } from './consultation'
export type Sex = 'male' | 'female' | 'undefined'

export class Animal {
  constructor(
    public name: string,
    public birthday: Date | number,
    public sex: Sex,
    public background: string,
    public breedKey: string,
    public consultations: Consultation[],
  ) { }
}
