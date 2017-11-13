import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { Component, EventEmitter, Output } from '@angular/core'

@Component({

  selector: 'app-image-input',
  templateUrl: './image-input.component.html',
  styleUrls: ['./image-input.component.scss']
})
export class ImageInputComponent {
  @Output() public imageChange = new EventEmitter()

  constructor(
    private _domSanitizer: DomSanitizer,
  ) { }

  public onImageChange(event: ProgressEvent) {
    const { target } = event
    const { files } = target as HTMLInputElement
    const image = files[0]
    const reader = new FileReader()
    reader.readAsDataURL(image)
    reader.onloadend = () => {
      this.imageChange.emit(reader.result)
    }
  }

}
