import { Person } from './person'
import { LatLng } from './latlng'
import { Animal } from './animal'
import { Address } from './address'
export class Customer implements Person {
  constructor(
    public firstName: string,
    public lastName: string,
    public tel: string,
    public email: string,
    public address: Address,
    public latlng: LatLng,
    public company?: string,
    public animals?: Animal[],
    public $key?: string,
    public $value?: string,
    public $exists?: () => boolean,
  ) { }
}
