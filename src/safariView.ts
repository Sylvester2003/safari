export default class SafariView extends HTMLElement {
  constructor() {
    super()

    this.createMenuBar()

    const h1 = document.createElement('h1')
    h1.textContent = 'Safari Game!'
    this.appendChild(h1)
  }

  private createMenuBar = () => {
    const menuBar = document.createElement('div')
    menuBar.style.backgroundColor = '#fafafa'
    menuBar.style.width = '100%'
    menuBar.style.display = 'flex'

    const container = document.createElement('div')
    container.style.margin = '0.6em'
    container.style.width = '100%'
    container.style.display = 'flex'
    container.style.justifyContent = 'space-between'
    container.style.alignItems = 'center'

    const openCloseButton = document.createElement('button')
    openCloseButton.style.padding = '0.5em 1em'
    openCloseButton.textContent = 'Open'
    container.appendChild(openCloseButton)

    const placeables = document.createElement('div')
    placeables.style.display = 'flex'
    placeables.style.gap = '0.4em'

    const tilesButton = document.createElement('button')
    tilesButton.style.padding = '0.5em 1em'
    tilesButton.textContent = 'T'
    placeables.appendChild(tilesButton)

    const carnivoresButton = document.createElement('button')
    carnivoresButton.style.padding = '0.5em 1em'
    carnivoresButton.textContent = 'C'
    placeables.appendChild(carnivoresButton)

    const herbivoresButton = document.createElement('button')
    herbivoresButton.style.padding = '0.5em 1em'
    herbivoresButton.textContent = 'H'
    placeables.appendChild(herbivoresButton)

    container.appendChild(placeables)

    const buyables = document.createElement('div')
    buyables.style.display = 'flex'
    buyables.style.gap = '0.4em'

    const buyJeepButton = document.createElement('button')
    buyJeepButton.style.padding = '0.5em 1em'
    buyJeepButton.textContent = 'Buy Jeep'
    buyables.appendChild(buyJeepButton)

    const chipButton = document.createElement('button')
    chipButton.style.padding = '0.5em 1em'
    chipButton.textContent = 'Buy Chip'
    buyables.appendChild(chipButton)

    container.appendChild(buyables)

    const settables = document.createElement('div')
    settables.style.display = 'flex'
    settables.style.gap = '0.4em'

    const entryFeeButton = document.createElement('button')
    entryFeeButton.style.padding = '0.5em 1em'
    entryFeeButton.textContent = 'E'
    settables.appendChild(entryFeeButton)

    const speedButton = document.createElement('button')
    speedButton.style.padding = '0.5em 1em'
    speedButton.textContent = 'S'
    settables.appendChild(speedButton)

    container.appendChild(settables)

    const sellAnimalButton = document.createElement('button')
    sellAnimalButton.style.padding = '0.5em 1em'
    sellAnimalButton.textContent = 'Sell Animal'
    container.appendChild(sellAnimalButton)

    menuBar.appendChild(container)
    this.appendChild(menuBar)
  }
}
