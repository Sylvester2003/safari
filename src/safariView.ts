import SafariButton from '@/safariButton'

/**
 * Class representing the SafariView component.
 *
 * @extends HTMLElement
 */
export default class SafariView extends HTMLElement {
  private _isPaused: boolean
  private _mainMenuDialog: HTMLDialogElement

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

    this._mainMenuDialog = this.createMainMenuDialog()
    game.appendChild(this._mainMenuDialog)

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

    this._isPaused = true
    window.addEventListener('keydown', this.handleKeyDown)
    this.gameLoop(0)
    this._mainMenuDialog.showModal()
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

    const openCloseButton = new SafariButton('#c0ffca', { text: 'Open', title: 'Open/Close' })
    leftGroup.appendChild(openCloseButton)

    const placeables = document.createElement('div')
    placeables.classList.add('group')

    const tilesButton = new SafariButton('#fff4a0', { image: '/src/img/tile_icon.png', title: 'Tiles' })
    tilesButton.style.padding = '0.5em 1em'
    placeables.appendChild(tilesButton)

    const carnivoresButton = new SafariButton('#ffab7e', { image: '/src/img/meat_icon.png', title: 'Carnivores' })
    carnivoresButton.style.padding = '0.5em 1em'
    placeables.appendChild(carnivoresButton)

    const herbivoresButton = new SafariButton('#e4ff6b', { image: '/src/img/herbivore_icon.png', title: 'Herbivores' })
    placeables.appendChild(herbivoresButton)

    leftGroup.appendChild(placeables)

    const buyables = document.createElement('div')
    buyables.classList.add('group')

    const buyJeepButton = new SafariButton('#b8f38b', { image: '/src/img/buy_jeep_icon.png', title: 'Buy Jeep' })
    buyables.appendChild(buyJeepButton)

    const chipButton = new SafariButton('#ffe449', { image: '/src/img/buy_chip_icon.png', title: 'Buy Chip' })
    buyables.appendChild(chipButton)

    leftGroup.appendChild(buyables)

    const settables = document.createElement('div')
    settables.classList.add('group')

    const entryFeeButton = new SafariButton('#e2fc9b', { image: '/src/img/ticket_icon.png', title: 'Entry Fee' })
    settables.appendChild(entryFeeButton)

    const speedButton = new SafariButton('#97b8ff', { image: '/src/img/time_icon.png', title: 'Speed' })
    settables.appendChild(speedButton)

    leftGroup.appendChild(settables)
    container.appendChild(leftGroup)

    const rightGroup = document.createElement('div')
    rightGroup.classList.add('group')

    const sellAnimalButton = new SafariButton('#b8f38b', { text: 'Sell', image: '/src/img/animal_icon.png', title: 'Sell Animal' })
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

    const fpsLabel = document.createElement('span')
    fpsLabel.id = 'fpsLabel'
    fpsLabel.textContent = 'FPS: 0'
    container.appendChild(fpsLabel)

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

  /**
   * Creates the main menu dialog for the SafariView component.
   *
   * @returns {HTMLDialogElement} The main menu dialog element.
   */
  private createMainMenuDialog = (): HTMLDialogElement => {
    const dialog = document.createElement('dialog')

    const container = document.createElement('div')
    container.classList.add('mainMenuDialog')

    const title = document.createElement('h1') // TODO: use premade logo instead of h1 element
    title.textContent = 'Safari Manager'
    container.appendChild(title)

    const buttonContainer = document.createElement('div')
    buttonContainer.classList.add('buttonContainer')
    container.appendChild(buttonContainer)

    const startButton = document.createElement('button')
    startButton.textContent = 'New Game'
    buttonContainer.appendChild(startButton)

    const howToPlayButton = document.createElement('button')
    howToPlayButton.textContent = 'How to Play'
    buttonContainer.appendChild(howToPlayButton)

    dialog.appendChild(container)
    return dialog
  }

  /**
   * Gets called repeatedly to update and render the game.
   * @param {DOMHighResTimeStamp} currentTime - The current time in milliseconds.
   * @param {DOMHighResTimeStamp} lastTime - The last time the game loop was called.
   */
  private gameLoop(currentTime: DOMHighResTimeStamp, lastTime: DOMHighResTimeStamp = 0) {
    if (!this._isPaused) {
      const deltaTime = (currentTime - lastTime) / 1000
      this.updateLabels(Math.round(1 / deltaTime))
      requestAnimationFrame(newTime => this.gameLoop(newTime, currentTime))
    }
    // console.error(currentTime) // comment out to monitor the gameloop state
  }

  private update() {

  }

  private render() {

  }

  private draw() {

  }

  /**
   * Updates the labels to show the stats of the game.
   * @param {number} fps - The current frames per second.
   */
  private updateLabels(fps: number) {
    const fpsLabel = this.querySelector('#fpsLabel')
    if (fpsLabel) {
      fpsLabel.textContent = `FPS: ${fps}`
    }
  }

  /**
   * Handles the keydown event to toggle the main menu dialog.
   *
   * @param {KeyboardEvent} event - The keydown event.
   */
  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      if (this._mainMenuDialog.open) {
        this._isPaused = false
        this._mainMenuDialog.close()
        requestAnimationFrame(time => this.gameLoop(time))
      }
      else {
        this._isPaused = true
        this._mainMenuDialog.showModal()
      }
    }
  }
}
