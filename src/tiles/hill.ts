import Tile from '@/tiles/tile'
import { tile } from '@/utils/registry';

@tile('safari:hill')
export default class Hill extends Tile {
  /**
   * not for use, only for the decorator.
   */
    constructor() {
      super(0, 0); 
    }
  
  public toString(): string {
    return 'safari:hill'
  }
}
