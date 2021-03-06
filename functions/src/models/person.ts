import { LatLng } from './latlng'
import { Address } from './address'
export interface Person {
  firstName: string
  lastName: string
  tel: string
  email: string
  address: Address
  latlng: LatLng
  $key?: string
  $value?: string
  $exists?: () => boolean
}
