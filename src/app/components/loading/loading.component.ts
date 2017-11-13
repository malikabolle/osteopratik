import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  private _message = 'Chargement en cours...Cela risque de prendre du temps.'
  @Input() set message(value: string) {
    if (value) {
      this._message = value
    }
  }
  get message() { return this._message }

  constructor() { }

  ngOnInit() {
  }

}
