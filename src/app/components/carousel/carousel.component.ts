import {
  ChangeDetectorRef,
  Component, AfterContentInit, OnInit,
  Input, Output, EventEmitter, HostListener,
  ContentChild, ElementRef, Renderer, ViewChild, ViewChildren,
} from '@angular/core'
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations'
import { Observable } from 'rxjs/Observable'

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  animations: [
    trigger('slide', [
      state(`to-right`, style({ transform: 'translateX(0)', position: '*' })),
      transition(`* => to-right`, animate(`400ms ease-in-out`, keyframes([
        style({ transform: 'translateX(100%)', position: 'absolute', offset: 0 }),
        style({ transform: 'translateX(0)', position: 'absolute', offset: 1 }),
      ]),
      )),
      transition(`to-right => *`, animate(`400ms ease-in-out`, keyframes([
        style({ transform: 'translateX(0)', position: 'absolute', offset: 0 }),
        style({ transform: 'translateX(-100%)', position: 'absolute', offset: 1 }),
      ]),
      )),

      state(`to-left`, style({ transform: 'translateX(0)', position: '*' })),
      transition(`* => to-left`, animate(`400ms ease-in-out`, keyframes([
        style({ transform: 'translateX(-100%)', position: 'absolute', offset: 0 }),
        style({ transform: 'translateX(0)', position: 'absolute', offset: 1 }),
      ]),
      )),
      transition(`to-left => *`, animate(`400ms ease-in-out`, keyframes([
        style({ transform: 'translateX(0)', position: 'absolute', offset: 0 }),
        style({ transform: 'translateX(100%)', position: 'absolute', offset: 1 }),
      ]),
      )),
    ]),
  ]
})
export class CarouselComponent implements AfterContentInit, OnInit {

  private _items: any[] = []
  @Input() public set items(items: any[]) {
    if (items && items.length) {
      this._items = items
      this.next()
      this.changeDetectorRef.detectChanges()
    }
  }
  public get items() { return this._items }

  @ContentChild('itemTemplate') public itemTemplate
  @ContentChild('selectorTemplate') public selectorTemplate

  private _selected: any
  @Output() public selectedChange = new EventEmitter<any>()

  public direction: string
  private _isAnimationRunning = false
  public set isAnimationRunning(value: boolean) {
    if (this._isAnimationRunning !== value) {
      this._isAnimationRunning = value
      // when clicking on the selected selector the animation.done isn't launched
      if (value) {
        setTimeout(() => {
          this._isAnimationRunning = false
        }, 400)
      }
    }
  }
  public get isAnimationRunning() {
    return this._isAnimationRunning
  }
  public backdropVisible: boolean

  private _color = 'accent'
  @Input() get color(): string { return this._color }
  set color(color: string) { this._color = color }

  constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    protected elementRef: ElementRef,
    protected renderer: Renderer,
  ) { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.selected = this.items[0] || {}
  }

  get selected(): any {
    return this._selected
  }
  @Input() set selected(item: any) {
    const actualIndex = this.selectedIndex
    const nextIndex = this.items.indexOf(item)
    const lastIndex = this.items.length - 1
    if (this.items.length > 2) {

      if (nextIndex > actualIndex) {
        this.direction = 'to-right'
      } else {
        this.direction = 'to-left'
      }
      if (actualIndex === lastIndex && nextIndex === 0) {
        this.direction = 'to-right'
      }
      if (actualIndex === 0 && nextIndex === lastIndex) {
        this.direction = 'to-left'
      }
    } else {
      this.direction = 'to-left'
    }

    this.changeDetectorRef.detectChanges()

    this._selected = item
    this.selectedChange.emit({ item, items: this.items, index: this.selectedIndex })
  }

  public get selectedIndex(): number {
    const index = this.items.indexOf(this.selected)
    return index
  }

  public next() {
    const index = this.items.indexOf(this.selected)

    if (index < this.items.length - 1) {
      this.selected = this.items[index + 1]
    } else {
      this.selected = this.items[0]
    }
  }

  public previous() {
    const index = this.items.indexOf(this.selected)
    if (!!index) {
      this.selected = this.items[index - 1]
    } else {
      this.selected = this.items[this.items.length - 1]
    }

  }

}
