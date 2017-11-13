import { Person } from './person'
import { LatLng } from './latlng'
import { Address } from './address'

export class Profile implements Person {
  constructor(
    public firstName: string,
    public lastName: string,
    public tel: string,
    public email: string,
    public address: Address,
    public latlng: LatLng,
    public $key?: string,
    public $value?: string,
    public $exists?: () => boolean,
  ) { }
}
