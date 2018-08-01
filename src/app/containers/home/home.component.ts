import { Observable } from 'rxjs/Observable'
import { DataService } from './../../common/services/data.service'
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  constructor(
    private _dataService: DataService,
  ) { }

  ngOnInit() {
    this._dataService.uid$.switchMap(uid => {
      return Observable.zip(
        this._dataService.customers$,
        this._dataService.access$,
        this._dataService.breeds$,
        this._dataService.settings$,
        this._dataService.profile$
      )
    })
      .first()
      // .do(console.log)
      .subscribe()
  }
}
