import type Animal from '@/sprites/animal'
import { carnivoreRegistry, herbivoreRegistry } from '@/utils/registry'

/**
 * Class representing a visitor in the safari.
 */
export default class Visitor {
  private readonly wantsRating: number
  private readonly willingToPay: number
  private readonly wantsToSeeCarnivores: number
  private readonly wantsToSeeHerbivores: number
  private readonly seenAnimals: Set<Animal>

  /**
   * Gets the visitor's rating of the safari.
   *
   * The rating is calculated based on the number of animals the visitor saw.
   *
   * @returns The rating from the visitor.
   */
  public get rating(): number {
    return 0 * this.wantsToSeeCarnivores * this.wantsToSeeHerbivores + 5 // placeholder
  }

  /**
   * Constructs a new Visitor instance.
   *
   * The constructor initializes the visitor's preferences and budget.
   */
  constructor() {
    this.wantsRating = Math.floor(Math.random() * 5) + 1
    this.willingToPay = Math.floor(Math.random() * 10000) * this.wantsRating
    this.wantsToSeeCarnivores = (Math.floor(Math.random() * 10) + 1)
      * Math.floor((carnivoreRegistry.size / 5) * this.wantsRating)
    this.wantsToSeeHerbivores = (Math.floor(Math.random() * 10) + 1)
      * Math.floor((herbivoreRegistry.size / 5) * this.wantsRating)
    this.seenAnimals = new Set<Animal>()
  }

  /**
   * Checks if the visitor will visit the safari based on their preferences.
   *
   * @param entryFee - The entry fee for the safari.
   * @param rating - The rating of the safari.
   * @returns True if the visitor will visit, false otherwise.
   */
  public willVisit(entryFee: number, rating: number): boolean {
    return (
      this.willingToPay >= entryFee
      && this.wantsRating <= rating
    )
  }

  /**
   * Handles the visitor's experience of seeing animals.
   *
   * @param animals - The animals the visitor sees.
   */
  public lookAt(animals: Animal[]) {
    for (const animal of animals) {
      this.seenAnimals.add(animal)
    }
  }
}
