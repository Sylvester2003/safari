import type DrawData from '@/drawData'
import SafariButton from '@/safariButton'
import SafariModel from '@/safariModel'
import { loadImage } from '@/utils/load'
import { calcGridPos } from './utils/calculate'
import { carnivoreRegistry, createCarnivore, createHerbivore, createTile, herbivoreRegistry, tileRegistry } from './utils/registry'
import './tiles'
import './sprites'
import './goals'

/**
 * Class representing the SafariView component.
 *
 * @extends HTMLElement
 */
export default class SafariView extends HTMLElement {
  private _gameModel?: SafariModel
  private _isPaused: boolean
  private _renderContext: CanvasRenderingContext2D
  private _unit: number

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
    canvas.addEventListener('click', this.handleGameAreaClick)
    canvasContainer.appendChild(canvas)
    this._renderContext = canvas.getContext('2d') as CanvasRenderingContext2D

    game.appendChild(this.createLabelsBar())
    this.appendChild(game)

    const mainMenuDialog = this.createMainMenuDialog()
    this.appendChild(mainMenuDialog)

    const difficultyDialog = this.createDifficultyDialog()
    this.appendChild(difficultyDialog)

    const tilesDialog = this.createTilesDialog()
    this.appendChild(tilesDialog)

    const carnivoresDialog = this.createCarnivoresDialog()
    this.appendChild(carnivoresDialog)

    const herbivoresDialog = this.createHerbivoresDialog()
    this.appendChild(herbivoresDialog)

    requestAnimationFrame(this.resizeCanvas)
    window.addEventListener('resize', () => {
      canvas.height = 0
      this.resizeCanvas()
    })

    this._unit = 1
    this._isPaused = true
    window.addEventListener('keydown', this.handleKeyDown)
    this.gameLoop(0)
    mainMenuDialog.showModal()
  }

  /**
   * Resizes the canvas to fit the container while maintaining the aspect ratio.
   */
  private resizeCanvas = () => {
    const canvasContainer = this.querySelector('.canvasContainer') as HTMLDivElement
    const canvas = this.querySelector('canvas') as HTMLCanvasElement
    const height = canvasContainer.offsetHeight

    if (this._gameModel)
      this._unit = Math.floor(height / this._gameModel.height) || 1

    const ratio = this._gameModel
      ? this._gameModel.width / this._gameModel.height
      : 0
    const h = Math.floor(height / this._unit)

    canvas.width = this._unit * h * ratio
    canvas.height = this._unit * h
  }

  /**
   * Gets called repeatedly to update and render the game.
   * @param {DOMHighResTimeStamp} currentTime - The current time in milliseconds.
   * @param {DOMHighResTimeStamp} lastTime - The last time the game loop was called.
   */
  private gameLoop = (currentTime: DOMHighResTimeStamp, lastTime: DOMHighResTimeStamp = 0) => {
    if (this._isPaused)
      return

    const deltaTime = (currentTime - lastTime) / 1000
    this.update()
    this.render()
    this.updateLabels(Math.round(1 / deltaTime))
    requestAnimationFrame(newTime => this.gameLoop(newTime, currentTime))
  }

  private update = () => {}

  /**
   * Renders the game by drawing all the draw data on the canvas.
   */
  private render = () => {
    if (!this._gameModel)
      return

    const drawDatas = this._gameModel.getAllDrawData()
    drawDatas.sort((a, b) => a.zIndex - b.zIndex)
    drawDatas.forEach(this.draw)
  }

  /**
   * Draws the object described by the given draw data on the canvas.
   *
   * @param data - The draw data describing the object to be drawn.
   */
  private draw = (data: DrawData) => {
    const image = loadImage(data.image)
    const [x, y] = data.getScreenPosition(this._unit)
    const size = data.getSize(this._unit)
    this._renderContext.drawImage(image, x, y, size, size)
  }

  /**
   * Updates the labels to show the stats of the game.
   * @param {number} fps - The current frames per second.
   */
  private updateLabels = (fps: number) => {
    const fpsLabel = this.querySelector('#fpsLabel')
    if (fpsLabel) {
      fpsLabel.textContent = `FPS: ${fps}`
    }
  }

  /**
   * Handles the click event for the "New Game" button.
   *
   * This method creates a new game model and starts the game loop.
   * It also closes the main menu dialog.
   */
  private clickNewGame = async (): Promise<void> => {
    const mainMenuDialog = document.querySelector('#mainMenuDialog') as HTMLDialogElement
    mainMenuDialog.close()

    const difficultyDialog = document.querySelector('#difficultyDialog') as HTMLDialogElement
    difficultyDialog.showModal()
  }

  private clickDifficulty = async (event: MouseEvent): Promise<void> => {
    const difficultyDialog = document.querySelector('#difficultyDialog') as HTMLDialogElement
    difficultyDialog.close()

    const target = event.target as HTMLElement
    const difficultyID = target.dataset.id

    this._gameModel = new SafariModel(difficultyID ?? 'safari:difficulty/normal')
    await this._gameModel.loadGame()
    this._isPaused = false

    requestAnimationFrame(time => this.gameLoop(time))
    this.resizeCanvas()
  }

  /**
   * Handles the click event for the "Tiles" button.
   */
  private clickTilesButton = () => {
    const tilesDialog = document.querySelector('#tilesDialog') as HTMLDialogElement
    tilesDialog.showModal()
  }

  /**
   * Handles the click event for the "Carnivores" button.
   */
  private clickCarnivoresButton = () => {
    const carnivoresDialog = document.querySelector('#carnivoresDialog') as HTMLDialogElement
    carnivoresDialog.showModal()
  }

  /**
   * Handles the click event for the "Herbivores" button.
   */
  private clickHerbivoresButton = () => {
    const herbivoresDialog = document.querySelector('#herbivoresDialog') as HTMLDialogElement
    herbivoresDialog.showModal()
  }

  /**
   * Handles the click event for any selectable button.
   *
   * @param event - The click event.
   */
  private clickSelectable = (event: MouseEvent) => {
    const selectedLabelImage = document.querySelector('.selectedSpriteLabelImage') as HTMLImageElement

    const target = event.target as HTMLElement
    const tileButton = target.closest('button') as SafariButton
    if (tileButton.dataset.selected === 'true') {
      tileButton.dataset.selected = 'false'
      selectedLabelImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
    }
    else {
      const selectedButton = document.querySelector('[data-selected="true"]') as SafariButton
      if (selectedButton)
        selectedButton.dataset.selected = 'false'
      tileButton.dataset.selected = 'true'
      selectedLabelImage.src = tileButton.image || ''
    }

    const dialogs = document.querySelectorAll('dialog')
    dialogs.forEach(dialog => dialog.close())
  }

  /**
   * Handles the click event on the game area.
   *
   * @param event - The click event.
   */
  private handleGameAreaClick = async (event: MouseEvent) => {
    const selected = document.querySelector('[data-selected="true"]') as SafariButton

    if (!selected) {
      // TODO: this._gameModel.selectSpriteAt(...calcCoords(event.offsetX, event.offsetY, this._unit))
      return
    }

    if (selected.dataset.type === 'tile') {
      await this._gameModel?.buyTile(
        selected.dataset.id ?? '',
        ...calcGridPos(event.offsetX, event.offsetY, this._unit),
      )
    }
    else if (selected.dataset.type === 'carnivore') {
      await this._gameModel?.buyCarnivore(
        selected.dataset.id ?? '',
        ...calcGridPos(event.offsetX, event.offsetY, this._unit),
      )
    }
    else if (selected.dataset.type === 'herbivore') {
      await this._gameModel?.buyHerbivore(
        selected.dataset.id ?? '',
        ...calcGridPos(event.offsetX, event.offsetY, this._unit),
      )
    }
  }

  /**
   * Handles the keydown event to toggle the main menu dialog.
   *
   * @param {KeyboardEvent} event - The keydown event.
   */
  private handleKeyDown = (event: KeyboardEvent) => {
    const mainMenuDialog = document.querySelector('#mainMenuDialog') as HTMLDialogElement
    if (event.key === 'Escape') {
      event.preventDefault()
      if (mainMenuDialog.open) {
        this._isPaused = false
        mainMenuDialog.close()
        requestAnimationFrame(time => this.gameLoop(time))
      }
      else {
        this._isPaused = true
        mainMenuDialog.showModal()
      }
    }
  }

  /**
   * Creates the main menu dialog for the SafariView component.
   *
   * @returns {HTMLDialogElement} The main menu dialog element.
   */
  private createMainMenuDialog = (): HTMLDialogElement => {
    const dialog = document.createElement('dialog')
    dialog.id = 'mainMenuDialog'

    const container = document.createElement('div')
    container.classList.add('mainMenuDialog')

    const title = document.createElement('img')
    title.classList.add('logo')
    title.src = '/resources/brand/logo.webp'
    title.alt = 'Safari Manager Logo'

    container.appendChild(title)

    const buttonContainer = document.createElement('div')
    buttonContainer.classList.add('buttonContainer')
    container.appendChild(buttonContainer)

    const startButton = new SafariButton('#b8f38b', { text: 'New Game', title: 'New Game' })
    startButton.addEventListener('click', this.clickNewGame)
    buttonContainer.appendChild(startButton)

    const howToPlayButton = new SafariButton('#fff4a0', { text: 'How to Play', title: 'How to Play' })
    buttonContainer.appendChild(howToPlayButton)

    dialog.appendChild(container)
    return dialog
  }

  private createDifficultyDialog = (): HTMLDialogElement => {
    const dialog = document.createElement('dialog')
    dialog.id = 'difficultyDialog'

    const container = document.createElement('div')
    container.classList.add('mainMenuDialog')

    const title = document.createElement('img')
    title.classList.add('logo')
    title.src = '/resources/brand/logo.webp'
    title.alt = 'Safari Manager Logo'

    container.appendChild(title)

    const buttonContainer = document.createElement('div')
    buttonContainer.classList.add('buttonContainer')
    container.appendChild(buttonContainer)

    const easyButton = new SafariButton('#b8f38b', { title: 'Easy', text: 'Easy' })
    easyButton.dataset.id = 'safari:difficulty/easy'
    easyButton.addEventListener('click', this.clickDifficulty)
    buttonContainer.appendChild(easyButton)

    const normalButton = new SafariButton('#ffab7e', { title: 'Normal', text: 'Normal' })
    normalButton.dataset.id = 'safari:difficulty/normal'
    normalButton.addEventListener('click', this.clickDifficulty)
    buttonContainer.appendChild(normalButton)

    const hardButton = new SafariButton('#e4ff6b', { title: 'Hard', text: 'Hard' })
    hardButton.dataset.id = 'safari:difficulty/hard'
    hardButton.addEventListener('click', this.clickDifficulty)
    buttonContainer.appendChild(hardButton)

    dialog.appendChild(container)
    return dialog
  }

  /**
   * Creates the tiles dialog for the SafariView component.
   *
   * @returns {HTMLDialogElement} The tiles dialog element.
   */
  private createTilesDialog = (): HTMLDialogElement => {
    const dialog = document.createElement('dialog')
    dialog.id = 'tilesDialog'

    const container = document.createElement('div')
    container.classList.add('selectDialog')

    const title = document.createElement('h1')
    title.textContent = 'Tiles'
    container.appendChild(title)

    const buttonContainer = document.createElement('div')
    buttonContainer.classList.add('buttonContainer')
    container.appendChild(buttonContainer)

    Array.from(tileRegistry.keys()).sort().forEach(async (tileId) => {
      const tile = createTile(tileId)
      const drawData = await tile?.loadDrawData()

      let image = ''
      if (drawData) {
        await drawData?.loadJsonData()
        image = drawData?.image
      }

      const tileButton = new SafariButton('#fff4a000', { image, title: tileId })
      tileButton.dataset.selectable = 'true'
      tileButton.dataset.selected = 'false'
      tileButton.dataset.type = 'tile'
      tileButton.dataset.id = tileId
      tileButton.addEventListener('click', this.clickSelectable)
      buttonContainer.appendChild(tileButton)
    })

    dialog.appendChild(container)
    return dialog
  }

  /**
   * Creates the carnivores dialog for the SafariView component.
   * @returns {HTMLDialogElement} The carnivores dialog element.
   */
  private createCarnivoresDialog = (): HTMLDialogElement => {
    const dialog = document.createElement('dialog')
    dialog.id = 'carnivoresDialog'

    const container = document.createElement('div')
    container.classList.add('selectDialog')

    const title = document.createElement('h1')
    title.textContent = 'Carnivores'
    container.appendChild(title)

    const buttonContainer = document.createElement('div')
    buttonContainer.classList.add('buttonContainer')
    container.appendChild(buttonContainer)

    Array.from(carnivoreRegistry.keys()).sort().forEach(async (animalId) => {
      const carnivore = createCarnivore(animalId)
      const drawData = await carnivore?.loadDrawData()

      let image = ''
      if (drawData) {
        await drawData?.loadJsonData()
        image = drawData?.image
      }

      const carnivoreButton = new SafariButton('#fff4a000', { image, title: animalId })
      carnivoreButton.dataset.selectable = 'true'
      carnivoreButton.dataset.selected = 'false'
      carnivoreButton.dataset.type = 'carnivore'
      carnivoreButton.dataset.id = animalId
      carnivoreButton.addEventListener('click', this.clickSelectable)
      buttonContainer.appendChild(carnivoreButton)
    })

    dialog.appendChild(container)
    return dialog
  }

  /**
   * Creates the herbivores dialog for the SafariView component.
   * @returns {HTMLDialogElement} The herbivores dialog element.
   */
  private createHerbivoresDialog = (): HTMLDialogElement => {
    const dialog = document.createElement('dialog')
    dialog.id = 'herbivoresDialog'

    const container = document.createElement('div')
    container.classList.add('selectDialog')

    const title = document.createElement('h1')
    title.textContent = 'Herbivores'
    container.appendChild(title)

    const buttonContainer = document.createElement('div')
    buttonContainer.classList.add('buttonContainer')
    container.appendChild(buttonContainer)

    Array.from(herbivoreRegistry.keys()).sort().forEach(async (animalId) => {
      const herbivore = createHerbivore(animalId)
      const drawData = await herbivore?.loadDrawData()

      let image = ''
      if (drawData) {
        await drawData?.loadJsonData()
        image = drawData?.image
      }

      const herbivoreButton = new SafariButton('#fff4a000', { image, title: animalId })
      herbivoreButton.dataset.selectable = 'true'
      herbivoreButton.dataset.selected = 'false'
      herbivoreButton.dataset.type = 'herbivore'
      herbivoreButton.dataset.id = animalId
      herbivoreButton.addEventListener('click', this.clickSelectable)
      buttonContainer.appendChild(herbivoreButton)
    })

    dialog.appendChild(container)
    return dialog
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

    const tilesButton = new SafariButton('#fff4a0', { image: '/resources/icons/tile_icon.webp', title: 'Tiles' })
    tilesButton.style.padding = '0.5em 1em'
    placeables.appendChild(tilesButton)
    tilesButton.addEventListener('click', this.clickTilesButton)

    const carnivoresButton = new SafariButton('#ffab7e', { image: '/resources/icons/meat_icon.webp', title: 'Carnivores' })
    carnivoresButton.style.padding = '0.5em 1em'
    placeables.appendChild(carnivoresButton)
    carnivoresButton.addEventListener('click', this.clickCarnivoresButton)

    const herbivoresButton = new SafariButton('#e4ff6b', { image: '/resources/icons/herbivore_icon.webp', title: 'Herbivores' })
    placeables.appendChild(herbivoresButton)
    herbivoresButton.addEventListener('click', this.clickHerbivoresButton)

    leftGroup.appendChild(placeables)

    const buyables = document.createElement('div')
    buyables.classList.add('group')

    const buyJeepButton = new SafariButton('#b8f38b', { image: '/resources/icons/buy_jeep_icon.webp', title: 'Buy Jeep' })
    buyables.appendChild(buyJeepButton)

    const chipButton = new SafariButton('#ffe449', { image: '/resources/icons/buy_chip_icon.webp', title: 'Buy Chip' })
    buyables.appendChild(chipButton)

    leftGroup.appendChild(buyables)

    const settables = document.createElement('div')
    settables.classList.add('group')

    const entryFeeButton = new SafariButton('#e2fc9b', { image: '/resources/icons/ticket_icon.webp', title: 'Entry Fee' })
    settables.appendChild(entryFeeButton)

    const speedButton = new SafariButton('#97b8ff', { image: '/resources/icons/time_icon.webp', title: 'Speed' })
    settables.appendChild(speedButton)

    leftGroup.appendChild(settables)
    container.appendChild(leftGroup)

    const rightGroup = document.createElement('div')
    rightGroup.classList.add('group')

    const sellAnimalButton = new SafariButton('#b8f38b', { text: 'Sell', image: '/resources/icons/animal_icon.webp', title: 'Sell Animal' })
    rightGroup.appendChild(sellAnimalButton)

    const selectedSpriteLabel = document.createElement('div')
    selectedSpriteLabel.classList.add('group')

    const selectedSpriteLabelText = document.createElement('span')
    selectedSpriteLabelText.textContent = 'Selected:'
    selectedSpriteLabel.appendChild(selectedSpriteLabelText)

    const selectedSpriteLabelImage = document.createElement('img')
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
}
