import { ThemeService, DARK_THEME, LIGHT_THEME } from './../../common/services/theme.service'
import { Component, AfterViewInit, ElementRef, Input, ViewChild } from '@angular/core'
import { defaultData, defaultOptions, defaultType, buildOptions } from './chart.model'
import Chart from 'chart.js'


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterViewInit {
  chart: Chart
  isDarkTheme: boolean

  private _type = defaultType
  private _data = {} as any
  private _options = {} as any
  private _config: { type, data, options }

  @Input() set type(value: string) {
    if (value) {
      this._type = value
      this.config = { type: value, data: this._data, options: this._options }
    }
  }
  @Input() set data(value: any) {
    if (value) {
      this._data = value
      this.config = { type: this._type, data: value, options: this._options }
    }
  }
  @Input() set options(value: any) {
    if (value) {
      this._options = value
      this._options.legend = { onClick: this._onLabelClick }
      this.config = { type: this._type, data: this._data, options: value }
    }
  }
  set config(value: { type, data, options }) {
    if (value) {
      this._config = value
      if (this.chart) {
        this.chart.config = this._config
        this.chart.update()
      } else {
        this.chart = new Chart(this.canvas.nativeElement, this._config)
        this.chart.update()
      }
      this._themeService
        .theme$$
        .asObservable()
        .first()
        .subscribe(this._adaptStyle)
    }
  }
  get config() { return this._config }

  @ViewChild('canvas', { read: ElementRef }) canvas: ElementRef

  constructor(
    private _themeService: ThemeService,
  ) {
    Chart.defaults.global.defaultFontFamily = 'Roboto Condensed'
  }

  ngAfterViewInit() {
    this._themeService
      .theme$$
      .asObservable()
      .filter(() => !!this._config)
      .subscribe(this._adaptStyle)
  }

  private _onLabelClick(event: Event, item: any) {
    // activate only the datasets that has been clicked last
    const currentIndex = item.datasetIndex
    this.chart
      .data
      .datasets
      .map((x, index) => index)
      .map(index => this.chart.getDatasetMeta(index))
      .forEach((meta, index) => {
        meta.hidden = !(index === currentIndex)
      })
    const meta = this.chart.getDatasetMeta(currentIndex)
    const values = this.chart.data.datasets[currentIndex].data
    const max = Math.max(...values)
    this.chart.options.scales.yAxes[0].ticks.max = max
    this.chart.update()
  }

  private _adaptStyle = theme => {
    Chart.defaults.global.defaultFontColor = theme === DARK_THEME ? '#ffffff' : '#212121'
    const toolbarColor = window.getComputedStyle(document.querySelector('.mat-toolbar'), null).getPropertyValue('background-color')
    this.config.data.datasets.map((dataSet) => dataSet.backgroundColor = toolbarColor)
    this.chart.update()
    this.chart = new Chart(this.canvas.nativeElement, this.config)
  }
}

