import Tile from '@/tiles/tile'
import { tile } from '@/utils/registry';

@tile('safari:grass')
export default class Grass extends Tile {
  /**
   * not for use, only for the decorator.
   */
    constructor() {
      super(0, 0); 
    }
  
  public toString(): string {
    return 'safari:grass'
  }
}
