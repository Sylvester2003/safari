export default class SafariView extends HTMLElement {
  constructor() {
    super()

    const game = document.createElement('div')
    game.style.width = '100vw'
    game.style.height = '100vh'
    game.style.display = 'flex'
    game.style.flexDirection = 'column'
    game.style.overflow = 'hidden'
    game.style.justifyContent = 'space-between'
    game.appendChild(this.createMenuBar())

    this.appendChild(game)
  }

  private createMenuBar = (): HTMLDivElement => {
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

    const leftGroup = document.createElement('div')
    leftGroup.style.display = 'flex'
    leftGroup.style.gap = '2em'

    const openCloseButton = document.createElement('button')
    openCloseButton.style.padding = '0.5em 1em'
    openCloseButton.textContent = 'Open'
    leftGroup.appendChild(openCloseButton)

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

    leftGroup.appendChild(placeables)

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

    leftGroup.appendChild(buyables)

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

    leftGroup.appendChild(settables)
    container.appendChild(leftGroup)

    const rightGroup = document.createElement('div')
    rightGroup.style.display = 'flex'
    rightGroup.style.gap = '2em'
    rightGroup.style.alignItems = 'center'

    const sellAnimalButton = document.createElement('button')
    sellAnimalButton.style.padding = '0.5em 1em'
    sellAnimalButton.textContent = 'Sell'
    rightGroup.appendChild(sellAnimalButton)

    const selectedSpriteLabel = document.createElement('div')
    selectedSpriteLabel.style.display = 'flex'
    selectedSpriteLabel.style.gap = '0.4em'
    selectedSpriteLabel.style.alignItems = 'center'

    const selectedSpriteLabelText = document.createElement('span')
    selectedSpriteLabelText.textContent = 'Selected:'
    selectedSpriteLabel.appendChild(selectedSpriteLabelText)

    const selectedSpriteLabelImage = document.createElement('div')
    selectedSpriteLabelImage.style.width = '2em'
    selectedSpriteLabelImage.style.height = '2em'
    selectedSpriteLabelImage.style.backgroundColor = 'gray'
    selectedSpriteLabel.appendChild(selectedSpriteLabelImage)

    rightGroup.appendChild(selectedSpriteLabel)

    container.appendChild(rightGroup)

    menuBar.appendChild(container)

    return menuBar
  }
}
