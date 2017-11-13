import { Observable } from 'rxjs/Observable'
import { Injectable } from '@angular/core'
import { GOOGLE_MAP_API_KEY } from './../config/google-map.config'
import { Http } from '@angular/http'

@Injectable()
export class GeocoderService {

  constructor(private _http: Http, ) { }

  geocode(street: string, zip: string, city: string, region: string, country: string): Observable<{ lat: number, lng: number }> {
    const compositeAddress = []
    compositeAddress.push(street, zip, city, region, country)
    const url = `https://maps.googleapis.com/maps/api/geocode/json?key=${GOOGLE_MAP_API_KEY}&address=${compositeAddress.join(',')}`
    if (navigator.onLine) {
      return this._http.get(url)
        .map(response => <any>response.json())
        .map(data => data.status === 'ZERO_RESULTS' ?
          { lat: 0, lng: 0 } :
          data.results[0].geometry.location || { lat: 0, lng: 0 })
    } else {
      return Observable.of({ lat: 0, lng: 0 })
    }
  }
}
