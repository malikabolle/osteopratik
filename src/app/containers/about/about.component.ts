import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core'
import { version } from '../../../environments/version'
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit {

  version = version

  constructor() { }

  ngOnInit() {
  }

}
