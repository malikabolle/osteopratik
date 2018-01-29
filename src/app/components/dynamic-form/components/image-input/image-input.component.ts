import { Component, EventEmitter, Input, Output, forwardRef, ElementRef, ViewChild } from '@angular/core'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { NG_VALUE_ACCESSOR, FormGroup, ControlValueAccessor } from '@angular/forms'
import { FieldConfig } from '../../models/field-config.interface'
import ImageCompressor from 'image-compressor.js'

@Component({
  providers: [{
    multi: true,
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ImageInputComponent),
  }],
  selector: 'app-image-input',
  templateUrl: './image-input.component.html',
  styleUrls: ['./image-input.component.scss']
})
export class ImageInputComponent implements ControlValueAccessor {
  config: FieldConfig
  group: FormGroup

  @ViewChild('input') inputRef
  @Input() public placeholder: string
  @Input() public name: string

  @Output() public imageChange = new EventEmitter()

  public size: string
  public dimensions: string
  public fileName: string
  public dataUrl: SafeResourceUrl
  public imageData: { blob: Blob, name: string }

  // ControlValueAccessor implementation
  private _image: { base64: string, name: string }
  public get image(): { base64: string, name: string } {
    return this._image
  }
  public set image(image: { base64: string, name: string }) {
    if (image) {
      this.writeValue(image)
      this._onChangeCallback(image)
    }
  }
  public writeValue(image: { base64: string, name: string }): void {
    this._image = image
    if (image) {
      this._getMetadata(image)
    }
  }
  public registerOnChange(fn: any): void { this._onChangeCallback = fn }
  public registerOnTouched(fn: any): void { this._onTouchCallback = fn }
  public _onChangeCallback: (_: { base64: string, name: string }) => void = () => { }
  public _onTouchCallback: () => void = () => { }

  constructor(
    private _domSanitizer: DomSanitizer,
    private _elementRef: ElementRef,
  ) { }

  public onImageChange(event: ProgressEvent) {
    const { target } = event
    const { files } = target as HTMLInputElement
    const options = {
      maxWidth: 1920,
      maxHeight: 1920,
      convertSize: 3000000,
      quality: 0.8,
    }
    const imageCompressor = new ImageCompressor(files[0], {
      ...options, success: file => {
        const reader = new FileReader()
          ; (new Promise((resolve, reject) => {
            reader.readAsDataURL(file)
            reader.onloadend = () => {
              const pic = { base64: reader.result, name: 'consultation_image' }
              resolve(pic)
            }
          }))
            .then((image) => {
              this.image = image as { base64, name }
              this.imageData = image['base64']
            })
      }
    })

  }

  private _getMetadata(image: { base64: string, name: string }) {
    this.dataUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(image.base64)
  }
}
