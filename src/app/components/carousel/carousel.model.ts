export interface ICarouselItem {

}

export class CarouselItem {
    constructor() {

    }
}

export interface ICarouselItemEvent extends Event {
    item: any
}

export class CarouselItemEvent {
    constructor(item: any) { }
}

export const TO_LEFT = 'to-left'
export const TO_RIGHT = 'to-right'
