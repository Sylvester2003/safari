export default class SafariView extends HTMLElement {
  constructor() {
    super()

    const h1 = document.createElement('h1')
    h1.textContent = 'Safari Game!'
    this.appendChild(h1)
  }
}
