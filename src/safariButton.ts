export default class SafariButton extends HTMLButtonElement {
  private _color!: string
  private _image?: string

  private readonly _initalColor: string
  private readonly _initialImage?: string

  constructor(color: string, options: { image?: string, text?: string, title?: string }) {
    super()

    this.title = options.title || ''
    this.textContent = options.text || ''
    this._initalColor = this.color = color
    this._initialImage = this.image = options.image

    this.classList.add('safariButton')
  }

  get color(): string {
    return this._color
  }

  set color(color: string) {
    this._color = color
    this.style.setProperty('--safari-btn-color', this._color)
  }

  get image(): string | undefined {
    return this._image
  }

  set image(image: string | undefined) {
    this._image = image
    const img = this.querySelector('img')

    if (!img) {
      if (!this._image)
        return

      const img = document.createElement('img')
      img.src = this._image || ''
      img.alt = this.textContent || ''
      this.appendChild(img)
      return
    }

    if (!this._image) {
      img.remove()
      return
    }

    img.src = this._image
  }

  public deSelect() {
    this.color = this._initalColor
    this.image = this._initialImage
  }
}
