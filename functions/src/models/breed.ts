export class Breed {
  constructor(
    public name: string,
    public price: number,
    public $key?: string,
    public $value?: string,
    public $exists?: string,
  ) { }
}
