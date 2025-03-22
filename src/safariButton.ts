export default class SafariButton extends HTMLButtonElement {
  private _color!: string
  private _image?: string

  constructor(color: string, options: SafariButtonOptions) {
    super()

    this.color = color
    this.image = options.image
  }

  get color(): string {
    return this._color
  }

  set color(color: string) {
    this._color = color
  }

  get image(): string | undefined {
    return this._image
  }

  set image(image: string | undefined) {
    this._image = image
  }
}

interface SafariButtonOptions {
  image?: string
  text?: string
}
