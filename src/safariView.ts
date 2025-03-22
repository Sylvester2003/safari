import SafariButton from '@/safariButton'

/**
 * Class representing the SafariView component.
 *
 * @extends HTMLElement
 */
export default class SafariView extends HTMLElement {
  /**
   * Creates an instance of the SafariView component.
   *
   * This constructor initializes the component and sets up the layout and
   * structure of the SafariView.
   */
  constructor() {
    super()

    const game = document.createElement('div')
    game.classList.add('game')

    game.appendChild(this.createMenuBar())

    const canvasContainer = document.createElement('div')
    canvasContainer.classList.add('canvasContainer')
    game.appendChild(canvasContainer)

    const canvas = document.createElement('canvas')
    canvas.style.backgroundColor = '#000000'
    canvasContainer.appendChild(canvas)

    game.appendChild(this.createLabelsBar())
    this.appendChild(game)

    const resizeCanvas = () => {
      const height = canvasContainer.offsetHeight
      canvas.width = height // todo: when we figured out the map size, make this so that it fits nicely on the screen
      canvas.height = height
    }

    requestAnimationFrame(resizeCanvas)
    window.addEventListener('resize', () => {
      canvas.height = 0
      resizeCanvas()
    })
  }

  /**
   * Creates the menu bar for the SafariView component.
   *
   * @returns {HTMLDivElement} The menu bar element.
   */
  private createMenuBar = (): HTMLDivElement => {
    const menuBar = document.createElement('div')
    menuBar.classList.add('menuBar')

    const container = document.createElement('div')
    container.classList.add('container')

    const leftGroup = document.createElement('div')
    leftGroup.classList.add('group')

    const openCloseButton = new SafariButton('#c0ffca', { text: 'Open' })
    leftGroup.appendChild(openCloseButton)

    const placeables = document.createElement('div')
    placeables.classList.add('group')

    const tilesButton = new SafariButton('#fff4a0', { image: '/src/img/chip.png' })
    tilesButton.style.padding = '0.5em 1em'
    placeables.appendChild(tilesButton)

    const carnivoresButton = new SafariButton('#ffab7e', { image: '/src/img/chip.png' })
    carnivoresButton.style.padding = '0.5em 1em'
    placeables.appendChild(carnivoresButton)

    const herbivoresButton = new SafariButton('#e4ff6b', { image: '/src/img/chip.png' })
    placeables.appendChild(herbivoresButton)

    leftGroup.appendChild(placeables)

    const buyables = document.createElement('div')
    buyables.classList.add('group')

    const buyJeepButton = new SafariButton('#b8f38b', { text: 'Buy Jeep' })
    buyables.appendChild(buyJeepButton)

    const chipButton = new SafariButton('#ffe449', { text: 'Buy Chip' })
    buyables.appendChild(chipButton)

    leftGroup.appendChild(buyables)

    const settables = document.createElement('div')
    settables.classList.add('group')

    const entryFeeButton = new SafariButton('#e2fc9b', { image: '/src/img/chip.png' })
    settables.appendChild(entryFeeButton)

    const speedButton = new SafariButton('#97b8ff', { image: '/src/img/chip.png' })
    settables.appendChild(speedButton)

    leftGroup.appendChild(settables)
    container.appendChild(leftGroup)

    const rightGroup = document.createElement('div')
    rightGroup.classList.add('group')

    const sellAnimalButton = new SafariButton('#b8f38b', { text: 'Sell', image: '/src/img/chip.png' })
    rightGroup.appendChild(sellAnimalButton)

    const selectedSpriteLabel = document.createElement('div')
    selectedSpriteLabel.classList.add('group')

    const selectedSpriteLabelText = document.createElement('span')
    selectedSpriteLabelText.textContent = 'Selected:'
    selectedSpriteLabel.appendChild(selectedSpriteLabelText)

    const selectedSpriteLabelImage = document.createElement('div')
    selectedSpriteLabelImage.classList.add('selectedSpriteLabelImage')
    selectedSpriteLabel.appendChild(selectedSpriteLabelImage)

    rightGroup.appendChild(selectedSpriteLabel)
    container.appendChild(rightGroup)
    menuBar.appendChild(container)

    return menuBar
  }

  /**
   * Creates the labels bar for the SafariView component.
   *
   * @returns {HTMLDivElement} The labels bar element.
   */
  private createLabelsBar = (): HTMLDivElement => {
    const labelsBar = document.createElement('div')
    labelsBar.classList.add('menuBar', 'labels')

    const container = document.createElement('div')
    container.classList.add('container')

    const tempLabelTexts = ['0/3', '12345', '199', '199', '35', '|||||', '2 Days']
    tempLabelTexts.map((text) => {
      const label = document.createElement('span')
      label.textContent = text
      return label
    }).forEach((label) => {
      container.appendChild(label)
    })

    labelsBar.appendChild(container)

    return labelsBar
  }
}
