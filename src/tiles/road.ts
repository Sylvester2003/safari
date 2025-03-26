import Tile from '@/tiles/tile'

export default class Road extends Tile {
  /**
   * not for use, only for the decorator.
   */
    constructor() {
      super(0, 0); 
    }
  
  public toString(): string {
    return 'safari:road'
  }
}
