import Tile from '@/tiles/tile'
import { tile } from '@/utils/registry';

@tile('safari:river')
export default class River extends Tile {
  /**
   * not for use, only for the decorator.
   */
    constructor() {
      super(0, 0); 
    }
  
  public toString(): string {
    return 'safari:river'
  }
}
