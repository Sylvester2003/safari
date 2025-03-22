export default class SafariButton extends HTMLButtonElement {
  private _color!: string
  private _image?: string

  constructor(color: string, options: SafariButtonOptions) {
    super()

    if (options.text) {
      const span = document.createElement('span')
      span.textContent = options.text || ''
      this.appendChild(span)
    }

    this.color = color
    this.image = options.image

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
}

interface SafariButtonOptions {
  image?: string
  text?: string
}
