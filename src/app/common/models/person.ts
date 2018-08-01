import { LatLng } from './latlng'
import { Address } from './address'
export interface Person {
  lastName: string
  tel: string
  address: Address
  firstName?: string
  email?: string
  latlng?: LatLng
  company?: string
  $key?: string
  $value?: string
  $exists?: () => boolean
}
