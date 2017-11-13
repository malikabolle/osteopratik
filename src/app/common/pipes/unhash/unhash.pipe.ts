import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'unhash'
})
export class UnhashPipe implements PipeTransform {

  transform(value: string, ): any {
    const matches = value.toString().match(/(.+?)(-)(.{20})/)
    return matches && matches.length === 4 ? `${matches[1]} (transfert)` : value
  }

}
